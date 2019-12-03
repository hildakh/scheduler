import React from "react";
import "components/DayListItem.scss";
const classnames = require('classnames');

export default function DayListItem(props) {
  // const [spot, setSpots] = useState(5);
  const formatSpots = (numberOfSpots) => {
    //
    // const decreaseSpots = () => {
    //   setSpots(spot -1);
    if (numberOfSpots === 0) {
      return `no spots remaining`;
    }
    if (numberOfSpots ===1) {
      return `1 spot remaining`;
    }
    return `${numberOfSpots} spots remaining`;
  }

  const dayClass = classnames("day-list__item", {
    "day-list__item--selected": props.selected === true,
    "day-list__item--full": props.spots === 0
  })

  return (
    <li className={dayClass} 
    onClick={() => props.setDay(props.name)}
    data-testid="day"
    >
      <h2 className="text--regular">{props.name}</h2> 
      <h3 className="text--light">{formatSpots(props.spots)}</h3>
    </li>
  );
}