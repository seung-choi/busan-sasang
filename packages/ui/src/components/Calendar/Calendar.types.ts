import type { 
    PropsBase,
    PropsSingle,
    PropsSingleRequired,
    PropsMulti,
    PropsMultiRequired,
    PropsRange,
    PropsRangeRequired
  } from "react-day-picker";


export type CalendarProps = PropsBase & (
    | PropsSingle
    | PropsSingleRequired
    | PropsMulti
    | PropsMultiRequired
    | PropsRange
    | PropsRangeRequired
  ) & {
    className?: string;
  };
