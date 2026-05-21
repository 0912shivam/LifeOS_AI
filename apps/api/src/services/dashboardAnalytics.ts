type ResourceDoc = {
  toObject: () => any;
};

type UserResourceSnapshot = {
  goals: ResourceDoc[];
  habits: ResourceDoc[];
  expenses: ResourceDoc[];
  studyTasks: ResourceDoc[];
};

const startOfMonth = () => {
  const date = new Date();
  return new Date(date.getFullYear(), date.getMonth(), 1);
};

const average = (values: number[]) => {
  if (values.length === 0) {
    return 0;
  }

  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(value);

const getHabitCompletionRate = (history: boolean[] = []) => {
  if (history.length === 0) {
    return 0;
  }

  return history.filter(Boolean).length / history.length;
};

const getUpcomingDays = (dateValue?: Date | null) => {
  if (!dateValue) {
    return Number.POSITIVE_INFINITY;
  }

  return Math.ceil((dateValue.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
};

export const buildDashboardAnalytics = (resources: UserResourceSnapshot) => {
  const goals = resources.goals.map((goal) => goal.toObject());
  const habits = resources.habits.map((habit) => habit.toObject());
  const expenses = resources.expenses.map((expense) => expense.toObject());
  const studyTasks = resources.studyTasks.map((task) => task.toObject());

  const incomeTotal = expenses.filter((item) => item.type === 'income').reduce((sum, item) => sum + item.amount, 0);
  const expenseTotal = expenses.filter((item) => item.type === 'expense').reduce((sum, item) => sum + item.amount, 0);
  const monthlyExpenses = expenses.filter((item) => {
    const itemDate = new Date(item.date);
    return itemDate >= startOfMonth();
  });

  const categoryTotals = monthlyExpenses.reduce<Record<string, number>>((accumulator, item) => {
    accumulator[item.category] = (accumulator[item.category] || 0) + item.amount;
    return accumulator;
  }, {});

  const weeklyHabitSeries = Array.from({ length: 7 }, (_value, index) => {
    const dayCompletionRates = habits.map((habit) => habit.history?.[index]).filter((value) => value !== undefined) as boolean[];
    const completionRate = dayCompletionRates.length === 0 ? 0 : dayCompletionRates.filter(Boolean).length / dayCompletionRates.length;

    return {
      day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index],
      value: Math.round(completionRate * 100)
    };
  });

  const goalProgressAverage = average(goals.map((goal) => goal.progress || 0));
  const habitConsistencyAverage = average(habits.map((habit) => Math.round(getHabitCompletionRate(habit.history) * 100)));
  const studyProgressAverage = average(studyTasks.map((task) => task.progress || 0));
  const financialHealthScore = incomeTotal === 0 ? 0 : Math.max(0, Math.round(((incomeTotal - expenseTotal) / Math.max(incomeTotal, 1)) * 100));

  const monthlySpending = Object.entries(categoryTotals)
    .sort((left, right) => right[1] - left[1])
    .slice(0, 5)
    .map(([name, value]) => ({ name, value }));

  const progress = [
    { label: 'Goals', value: goalProgressAverage },
    { label: 'Habits', value: habitConsistencyAverage },
    { label: 'Expenses', value: financialHealthScore },
    { label: 'Study', value: studyProgressAverage }
  ];

  const upcomingItems = [
    ...goals
      .filter((goal) => getUpcomingDays(goal.dueDate) <= 30)
      .map((goal) => ({
        date: goal.dueDate ? new Date(goal.dueDate).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10),
        label: `Goal due: ${goal.title}`
      })),
    ...studyTasks
      .filter((task) => getUpcomingDays(task.examReminderAt || task.deadline) <= 30)
      .map((task) => ({
        date: task.examReminderAt ? new Date(task.examReminderAt).toISOString().slice(0, 10) : new Date(task.deadline).toISOString().slice(0, 10),
        label: `Study reminder: ${task.subject}`
      }))
  ]
    .sort((left, right) => left.date.localeCompare(right.date))
    .slice(0, 5);

  const aiInsights: string[] = [];

  const weakGoals = goals.filter((goal) => goal.progress < 60 && getUpcomingDays(goal.dueDate) <= 45);
  if (weakGoals.length > 0) {
    aiInsights.push(`You have ${weakGoals.length} goal(s) at risk of missing their due date. Schedule focused work blocks this week.`);
  }

  const lowConsistencyHabits = habits.filter((habit) => getHabitCompletionRate(habit.history) < 0.7);
  if (lowConsistencyHabits.length > 0) {
    aiInsights.push(`Habit consistency is uneven for ${lowConsistencyHabits.map((habit) => habit.title).join(', ')}. Reduce friction with a smaller daily target.`);
  }

  const overspentCategories = monthlySpending.filter((entry) => entry.value >= expenseTotal * 0.25);
  if (overspentCategories.length > 0) {
    aiInsights.push(`Spending is concentrated in ${overspentCategories.map((entry) => entry.name).join(', ')}. Tighten those categories before month-end.`);
  }

  const laggingStudyTasks = studyTasks.filter((task) => task.progress < 50 || getUpcomingDays(task.deadline) <= 10);
  if (laggingStudyTasks.length > 0) {
    aiInsights.push(`Study planning needs attention for ${laggingStudyTasks.map((task) => task.subject).join(', ')}.`);
  }

  if (aiInsights.length === 0) {
    aiInsights.push('Your current habits, goals, and study plan look balanced. Keep the same weekly rhythm and review progress next week.');
  }

  const riskSignals = [
    {
      area: 'Goals',
      score: Math.max(0, 100 - goalProgressAverage),
      message: weakGoals.length > 0 ? `${weakGoals.length} goal(s) need attention` : 'Goal progress is on track'
    },
    {
      area: 'Habits',
      score: Math.max(0, 100 - habitConsistencyAverage),
      message: lowConsistencyHabits.length > 0 ? 'Some habits are losing consistency' : 'Habit streaks are stable'
    },
    {
      area: 'Expenses',
      score: financialHealthScore,
      message: expenseTotal > incomeTotal ? 'You spent more than you earned this month' : `Monthly net is ${formatCurrency(Math.max(incomeTotal - expenseTotal, 0))}`
    }
  ];

  const recommendations = [
    weakGoals.length > 0 ? `Work on ${weakGoals[0].title} for 2 deep-focus sessions before the week ends.` : 'Keep your current goal cadence and review progress on Sunday.',
    lowConsistencyHabits.length > 0 ? `Pair ${lowConsistencyHabits[0].title} with an existing routine to raise streak reliability.` : 'Your habits are solid; preserve the current routine.',
    expenseTotal > incomeTotal ? 'Reduce discretionary spending this month and review top categories daily.' : 'Your finances are healthy; keep tracking category limits.'
  ];

  return {
    cards: {
      goals: goals.length,
      habits: habits.length,
      expenses: expenses.length,
      studyTasks: studyTasks.length
    },
    progress,
    weeklyHabit: weeklyHabitSeries,
    monthlySpending,
    aiInsights,
    calendar: upcomingItems,
    goals,
    habits,
    expenses,
    studyTasks,
    riskSignals,
    recommendations,
    finance: {
      incomeTotal,
      expenseTotal,
      netTotal: incomeTotal - expenseTotal
    }
  };
};
