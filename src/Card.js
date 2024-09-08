import React from "react";
import "./Card.css";

export default class Card extends React.Component {
  render() {
    const { id, name, status } = this.props;

    // Apply different class names based on status
    let className = ["Card"];
    if (status === "backlog") {
      className.push("Card-grey");
    } else if (status === "ongoing") {
      className.push("Card-blue");
    } else if (status === "complete") {
      className.push("Card-green");
    }

    return (
      <div className={className.join(" ")} data-id={id} data-status={status}>
        <div className="Card-title">{name}</div>
      </div>
    );
  }
}
