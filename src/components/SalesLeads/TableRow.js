import React, { Component } from "react";

// import ReactTable from 'react-table'

class TableRow extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <tr>
        <td>{this.props.obj.SalesLeadDate}</td>
        <td>{this.props.obj.ContactName}</td>
        <td>{this.props.obj.FromCity}</td>
        <td>{this.props.obj.ToCity}</td>
        <td>{this.props.obj.ManagedBy}</td>
        {/* <td>{this.props.obj.DCity}</td>
        <td>{this.props.obj.WorkingOnProposal}</td> */}
        {/* <td>{this.props.obj.ProposalType}</td> */}
        <td>{this.props.obj.SalesLeadFollowupDate}</td>
        {/* <td>{this.props.obj.ProposalStatus}</td> */}
      </tr>
    );
  }
}
export default TableRow;
