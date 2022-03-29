export enum DateFormat {
  TimeShort,
  Full,
}

export const dateToFormat = (date: Date, format: DateFormat): string => {
  switch (format) {
    case DateFormat.TimeShort:
      {
        const minutes = date.getMinutes();
        return `${date.getHours()}:${minutes < 10 ? `0${minutes}` : minutes}`;
      }
      break;
    case DateFormat.Full:
      {
        return date.toLocaleString();
      }
      break;
  }
};
