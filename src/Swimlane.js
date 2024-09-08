import React from "react";
import Card from "./Card";
import "./Swimlane.css";

export default class Swimlane extends React.Component {
  render() {
    const { clients, name, dragulaRef, status } = this.props;

    const cards = clients.map((client) => <Card key={client.id} id={client.id} name={client.name} description={client.description} status={client.status} />);

    return (
      <div className="Swimlane-column">
        <div className="Swimlane-title">{name}</div>
        <div className="Swimlane-dragColumn" ref={dragulaRef} data-status={status}>
          {cards}
        </div>
      </div>
    );
  }
}
