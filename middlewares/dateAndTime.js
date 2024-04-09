const { catchAsyncErrors } = require("./catchAsyncErrors");

exports.dateAndTime = () => {
  const currentDate = new Date();
  const currentyear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const currentDay = currentDate.getDate();
  const year = `${currentyear}-${currentMonth + 1}-${currentDay}`;

  const currentHour = currentDate.getHours();
  const currentMinute = currentDate.getMinutes();
  const currentSecond = currentDate.getSeconds();
  const currentTime = `${currentHour}:${currentMinute}:${currentSecond}`;

  const formattedDate = `${currentTime} ${year}`;
  return {
    formattedDate,
    currentyear,
    currentMonth,
    currentDay,
    year,
    currentHour,
    currentMinute,
    currentSecond,
    currentTime,
  };
};
