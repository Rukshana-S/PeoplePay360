export const SCHEDULES = [
  {
    id: "sch-1",
    name: "Regular (40h)",
    type: "Standard Full-Time",
    weeklyHours: 40,
    days: [
      { day: "Monday", start: "09:00", end: "17:00", breakHours: 1, dailyHours: 8 },
      { day: "Tuesday", start: "09:00", end: "17:00", breakHours: 1, dailyHours: 8 },
      { day: "Wednesday", start: "09:00", end: "17:00", breakHours: 1, dailyHours: 8 },
      { day: "Thursday", start: "09:00", end: "17:00", breakHours: 1, dailyHours: 8 },
      { day: "Friday", start: "09:00", end: "17:00", breakHours: 1, dailyHours: 8 },
      { day: "Saturday", start: "Off", end: "Off", breakHours: 0, dailyHours: 0 },
      { day: "Sunday", start: "Off", end: "Off", breakHours: 0, dailyHours: 0 },
    ]
  },
  {
    id: "sch-2",
    name: "Intern (30h)",
    type: "Part-Time Internship",
    weeklyHours: 30,
    days: [
      { day: "Monday", start: "09:00", end: "15:00", breakHours: 0.5, dailyHours: 6 },
      { day: "Tuesday", start: "09:00", end: "15:00", breakHours: 0.5, dailyHours: 6 },
      { day: "Wednesday", start: "09:00", end: "15:00", breakHours: 0.5, dailyHours: 6 },
      { day: "Thursday", start: "09:00", end: "15:00", breakHours: 0.5, dailyHours: 6 },
      { day: "Friday", start: "09:00", end: "15:00", breakHours: 0.5, dailyHours: 6 },
      { day: "Saturday", start: "Off", end: "Off", breakHours: 0, dailyHours: 0 },
      { day: "Sunday", start: "Off", end: "Off", breakHours: 0, dailyHours: 0 },
    ]
  },
  {
    id: "sch-3",
    name: "Contractor (Flexible)",
    type: "Flexible Hourly",
    weeklyHours: 35,
    days: [
      { day: "Monday", start: "Flexible", end: "Flexible", breakHours: 1, dailyHours: 7 },
      { day: "Tuesday", start: "Flexible", end: "Flexible", breakHours: 1, dailyHours: 7 },
      { day: "Wednesday", start: "Flexible", end: "Flexible", breakHours: 1, dailyHours: 7 },
      { day: "Thursday", start: "Flexible", end: "Flexible", breakHours: 1, dailyHours: 7 },
      { day: "Friday", start: "Flexible", end: "Flexible", breakHours: 1, dailyHours: 7 },
      { day: "Saturday", start: "Flexible", end: "Flexible", breakHours: 0, dailyHours: 0 },
      { day: "Sunday", start: "Flexible", end: "Flexible", breakHours: 0, dailyHours: 0 },
    ]
  },
  {
    id: "sch-4",
    name: "Shift Operations (45h)",
    type: "Extended Operational Shift",
    weeklyHours: 45,
    days: [
      { day: "Monday", start: "08:00", end: "17:00", breakHours: 1, dailyHours: 9 },
      { day: "Tuesday", start: "08:00", end: "17:00", breakHours: 1, dailyHours: 9 },
      { day: "Wednesday", start: "08:00", end: "17:00", breakHours: 1, dailyHours: 9 },
      { day: "Thursday", start: "08:00", end: "17:00", breakHours: 1, dailyHours: 9 },
      { day: "Friday", start: "08:00", end: "17:00", breakHours: 1, dailyHours: 9 },
      { day: "Saturday", start: "Off", end: "Off", breakHours: 0, dailyHours: 0 },
      { day: "Sunday", start: "Off", end: "Off", breakHours: 0, dailyHours: 0 },
    ]
  }
];
