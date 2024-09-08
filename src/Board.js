import React from "react";
import Dragula from "dragula";
import "dragula/dist/dragula.css";
import Swimlane from "./Swimlane";
import "./Board.css";

export default class Board extends React.Component {
  constructor(props) {
    super(props);
    const clients = this.getClients();
    this.state = {
      clients: {
        backlog: clients.filter((client) => client.status === "backlog"),
        ongoing: clients.filter((client) => client.status === "ongoing"),
        complete: clients.filter((client) => client.status === "complete"),
      },
    };
    this.swimlanes = {
      backlog: React.createRef(),
      ongoing: React.createRef(),
      complete: React.createRef(),
    };
  }

  componentDidMount() {
    const containers = [this.swimlanes.backlog.current, this.swimlanes.ongoing.current, this.swimlanes.complete.current];

    const drake = Dragula(containers, {
      moves: (el, container, handle) => {
        return handle.classList.contains("Card-title");
      },
    });

    drake.on("drop", (el, target, source, sibling) => {
      const cardId = el.dataset.id;
      const newStatus = target.dataset.status; // Get the new status from the swimlane
      const newStatusKey = newStatus.replace("-", " "); // Convert 'in-progress' to 'in Progress'
      const siblingId = sibling ? sibling.dataset.id : null; // Get sibling if available

      // Disable Dragula while React is updating the DOM
      drake.cancel(true);

      this.setState(
        (prevState) => {
          const updatedClients = { ...prevState.clients };
          let movedCard;

          // Check if newStatusKey exists in updatedClients, if not, initialize it
          if (!updatedClients[newStatusKey]) {
            updatedClients[newStatusKey] = [];
          }

          // Remove the card from its original list
          Object.keys(updatedClients).forEach((key) => {
            updatedClients[key] = updatedClients[key].filter((client) => {
              if (client.id === cardId) {
                movedCard = { ...client, status: newStatus }; // Update card status
                return false;
              }
              return true;
            });
          });

          // Log newStatus and movedCard for debugging
          console.log("Moving card:", movedCard);
          console.log("New swimlane:", newStatus);

          // If the card was moved successfully, add it to the new swimlane
          if (movedCard) {
            let newClientList = [...updatedClients[newStatusKey]]; // Spread the current list

            if (siblingId) {
              // Find the position of the sibling and insert the card before it
              const siblingIndex = newClientList.findIndex((client) => client.id === siblingId);
              newClientList.splice(siblingIndex, 0, movedCard);
            } else {
              // No sibling means adding it at the end of the list
              newClientList.push(movedCard);
            }

            updatedClients[newStatusKey] = newClientList;
          }

          return { clients: updatedClients };
        },
        () => {
          // Re-enable Dragula after React update is complete
          drake.containers = containers;
        }
      );
    });
  }

  getClients() {
    return [["1", "Stark, White and Abbott", "Cloned Optimal Architecture", "ongoing"], ["2", "Wiza LLC", "Exclusive Bandwidth-Monitored Implementation", "complete"], ["3", "Nolan LLC", "Vision-Oriented 4Thgeneration Graphicaluserinterface", "backlog"], ["4", "Thompson PLC", "Streamlined Regional Knowledgeuser", "ongoing"], ["5", "Walker-Williamson", "Team-Oriented 6Thgeneration Matrix", "ongoing"], ["6", "Boehm and Sons", "Automated Systematic Paradigm", "backlog"], ["7", "Runolfsson, Hegmann and Block", "Integrated Transitional Strategy", "backlog"], ["8", "Schumm-Labadie", "Operative Heuristic Challenge", "backlog"], ["9", "Kohler Group", "Re-Contextualized Multi-Tasking Attitude", "backlog"], ["10", "Romaguera Inc", "Managed Foreground Toolset", "backlog"], ["11", "Reilly-King", "Future-Proofed Interactive Toolset", "complete"], ["12", "Emard, Champlin and Runolfsdottir", "Devolved Needs-Based Capability", "backlog"], ["13", "Fritsch, Cronin and Wolff", "Open-Source 3Rdgeneration Website", "complete"], ["14", "Borer LLC", "Profit-Focused Incremental Orchestration", "backlog"], ["15", "Emmerich-Ankunding", "User-Centric Stable Extranet", "ongoing"], ["16", "Willms-Abbott", "Progressive Bandwidth-Monitored Access", "ongoing"], ["17", "Brekke PLC", "Intuitive User-Facing Customerloyalty", "complete"], ["18", "Bins, Toy and Klocko", "Integrated Assymetric Software", "backlog"], ["19", "Hodkiewicz-Hayes", "Programmable Systematic Securedline", "backlog"], ["20", "Murphy, Lang and Ferry", "Organized Explicit Access", "backlog"]].map((companyDetails) => ({
      id: companyDetails[0],
      name: companyDetails[1],
      description: companyDetails[2],
      status: companyDetails[3],
    }));
  }

  renderSwimlane(name, clients, ref) {
    const status = name.toLowerCase().replace(" ", "-");
    return <Swimlane name={name} clients={clients} dragulaRef={ref} status={status} />;
  }

  render() {
    return (
      <div className="Board">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-4">{this.renderSwimlane("Backlog", this.state.clients.backlog, this.swimlanes.backlog)}</div>
            <div className="col-md-4">{this.renderSwimlane("Ongoing", this.state.clients.ongoing, this.swimlanes.ongoing)}</div>
            <div className="col-md-4">{this.renderSwimlane("Complete", this.state.clients.complete, this.swimlanes.complete)}</div>
          </div>
        </div>
      </div>
    );
  }
}
