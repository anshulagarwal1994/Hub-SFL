import React,{Component} from "react";
// react component for creating dynamic tables
import ReactTable from "react-table";
// @material-ui/icons
import HeadsetMic from "@material-ui/icons/HeadsetMic";
// core components
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardIcon from "components/Card/CardIcon.js";
import CardHeader from "components/Card/CardHeader.js";
import {CommonConfig} from '../../utils/constant';
import moment from 'moment';
import SimpleBackdrop from '../../utils/general';
import api from '../../utils/apiClient';
import cogoToast from "cogo-toast";

import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import Checkbox from '@material-ui/core/Checkbox';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

class FileaClaim extends Component {
  constructor(props){
    super(props);
    this.state = {
        FileAClaimData:[],
        ClaimID:"",
        Loading:false,
        loggedUser:0,
        AllAccess:0,
        filterProps:[],
        previousFilterList:[],
        sortProps:[],
        previousSortList:[],
        ReadAccess:0,
        statusList:[],
        finalLength:0,
        checkdata: "",
        IsDropDownShow: false,
        requestStatus: [
          { label: "All", value: "All", IsSelected: false, Index: 0 },
          { label: "New", value: "New", IsSelected: true, Index: 1 },
          { label: "Open", value: "Open", IsSelected: false, Index: 2 },
          { label: "Closed", value: "Closed", IsSelected: false, Index: 3 },
          { label: "Cancelled", value: "Cancelled", IsSelected: false, Index: 4 },
          ]
        };
  }
  componentDidMount()
  {
      this.setState({
        AllAccess:CommonConfig.getUserAccess("File a Claim").AllAccess,
        ReadAccess:CommonConfig.getUserAccess("File a Claim").ReadAccess,
        loggedUser:CommonConfig.loggedInUserData().PersonID
    });
    let APIcheck = true;
      if(this.props.history.location.state !== undefined && this.props.history.location.state !== null){
        this.setState({
          previousFilterList : this.props.history.location.state.filterlist,
          previousSortList : this.props.history.location.state.sortlist,
          statusList : this.props.history.location.state.statusList !== undefined ? this.props.history.location.state.statusList : this.state.statusList
        });
        if(this.props.history.location.state.statusList !== undefined){
          APIcheck = false
          this.filterMethod("",this.props.history.location.state.statusList) ;
        }  
      }
      else{
          var finalStatus = {
            id:"ClaimStatus",
            value:""
          }
          var finalSort = 
          {
            id: "CreatedOn",
            desc: true
          }
          this.setState({previousFilterList:[finalStatus],previousSortList:[finalSort]});
        } 
        if(APIcheck){
          let newFilter = [{label:"New" ,value:"New"}]
          this.filterMethod("",newFilter);
        }
  }

  showLoador=()=>{
    this.setState({Loading:true});
  }

  hideLoador=()=>{
    this.setState({Loading:false});
  }

  getClaimList=(whereClause)=>{
    let data = {

    };
    if(!CommonConfig.isEmpty(whereClause)){
      data.StatusQuery = whereClause;
    }
    try{
      this.showLoador();
      api.post("claim/getClaimList",data).then(result => {
          if (result.success) {
                  this.hideLoador();
                  if(this.state.AllAccess===1)
                  {
                      this.setState({FileAClaimData:result.data});
                  }
                  else
                  {
                  let finalData=result.data.filter(x=>x.ManagedBy===this.state.loggedUser);
                  this.setState({ FileAClaimData: finalData});
                  }
          } else {
            this.hideLoador();
          cogoToast.error("Something went wrong");
          }

      }).catch(err=>{
        this.hideLoador();
        cogoToast.error("Something went wrong");
      });
  }catch(err)
      { 
        this.hideLoador();
        cogoToast.error("Something Went Wrong");
      }
  }

  handleEdit=(record)=> {
    let ClaimID = record.original.ClaimID;
    this.props.history.push({
      pathname:'ViewFileAClaim/'+ ClaimID,
      state:{filterlist:this.state.filterProps,statusList:this.state.statusList,sortlist:this.state.sortProps}
    })
  }

  redirectAdd = () => {
    this.props.history.push("/admin/AddaClaim");
  }
  
  filterMethod = (event,value) => {
    if(value !== null){
      if(value.length !== 0){
        value = value.filter((v,i,a) => a.findIndex(t => (t.value === v.value)) === i);
        let query = '';
        let StatusQuery = '';
        let allFilter = value.findIndex(x => x.value === "All");
        if(allFilter === 0){
          value.splice(allFilter, 1);
          allFilter = -1
        }
        if(allFilter === -1){
              
            for(var j = 0;j < value.length;j++){
              if(j === 0){
                  if(value.length === 1 ){
                      StatusQuery = ` AND ( c.ClaimStatus = "`+value[j].value +`")`;
                  }
                  else{
                      StatusQuery = ` AND ( c.ClaimStatus = "`+value[j].value +`"`;
                  }
                  
              }
              else if(j + 1 === value.length){
                  StatusQuery = ` OR c.ClaimStatus = "`+value[j].value +`")`;
              }
              else{
                  StatusQuery = ` OR c.ClaimStatus = "`+value[j].value +`"`;
              }
              query = query + StatusQuery;
          }
        }
        else{
          value = [{label:'All',value:'All'}];
        }
        this.getClaimList(query);
      }
      else{
        this.setState({FileAClaimData : []});
      }
      this.setState({statusList: value});
    }
  }
  
  searchfilter = () => {
    this.setState({ IsDropDownShow: false });
    try {
      let Query = "";
      let inputdata = this.state.checkdata;
      if (inputdata === "All") {
        Query = inputdata;
      } else if (inputdata === "") {
        this.setState({ CallbackData: [] });
      } else if (inputdata.length === 1) {
        Query = ` AND ( c.ClaimStatus  = "` + inputdata[0].value + `")`;
      } else {
        for (var j = 0; j < inputdata.length; j++) {
          if (j === 0) {
            Query = ` AND ( c.ClaimStatus  = "` + inputdata[j].value + `"`;
          } else {
            Query =
              Query + ` OR c.ClaimStatus  = "` + inputdata[j].value + `"`;
          }
        }
        if (!CommonConfig.isEmpty(Query)) {
          Query = Query + `)`;
        }
      }
      this.getClaimList(Query);
    } catch (err) {
      cogoToast.error("Something went wrong");
    }
  };

  setFilterProps = (filterValue) => {
    this.setState({filterProps: filterValue.filtered,sortProps:filterValue.sorted});
  }

  filterProps = (e) => {
    if(this.state.filterProps !== e.filtered){
      this.setFilterProps(e);
    }
    if(this.state.sortProps !== e.sorted){
      this.setFilterProps(e)
    }
    return '';
  }

  setLength = (len) => {
    this.setState({finalLength : len});
  }
  
  handleCheckboxChange = (e, record, type) => {
    let checkedArr = this.state.requestStatus;
    if (type !== "All") {
      checkedArr
        .filter((x) => x.value === "All")
        .map((OBJ) => {
          OBJ.IsSelected = false;
          return OBJ;
        });
      checkedArr[record.Index]["IsSelected"] = e.target.checked;
      this.setState({
        checkAll: e.target.checked,
        //StatusList[0].IsSelected:true
      });
      let previousList = checkedArr.filter((x) => x.IsSelected === true);
      this.setState({ checkdata: previousList });
    } else {
      checkedArr.map((OBJ) => {
        OBJ.IsSelected = e.target.checked;
        return OBJ;
      });

      this.setState({
        checkAll: e.target.checked,
      });
      let previousList = checkedArr.filter((x) => x.IsSelected === true);
      let arrType = "previousSelectedStatusList";
      if (previousList.length === 0) {
        this.state.checkdata = "";
      } else {
        this.state.checkdata = `All`;
      }
      this.setState({
        requestStatus: checkedArr,
      });
    }
  };

  checkProps = (e) => {
    if(this.state.finalLength !== e.sortedData.length){
      this.setLength(e.sortedData.length);
    }
    return '';
  }

  
  renderInputMethod = (params) => {
    return (
      <TextField {...params} variant="outlined" label="Status" />
    )
  }

  optionProps = (option ,value) => {
    if(option.value === value.value){
        return true;
    }
    else{
        return false;
    }
  }
  
  


   render()
   {
    const { FileAClaimData } = this.state;
    
    const column=[
        {
            Header: "Tracking",
            accessor: "TrackingNumber",
            width: 100,
            maxWidth: 100,
        },
        {
            Header: "ClaimPerson",
            accessor: "ClaimPerson",
            width: 100,
            maxWidth: 100,
        },
        {
            Header: "Claim Type",
            accessor: "TypeofClaim",
            width: 115,
            maxWidth: 115,
        },
        {
            Header: "ManagedBy",
            accessor: "ManagedByName",
            width: 120,
            maxWidth: 120,
        },
        {
            Header: "Status",
            accessor: "ClaimStatus",
            width: 150,
            maxWidth: 150,
        },
        {   id:"CreatedOn",
            Header: "Claim Date",
            sortMethod: (a, b) => {
              return CommonConfig.dateSortMethod(a,b);
            },
            accessor: data => {
                return moment(data.CreatedOn).format(CommonConfig.dateFormat.dateOnly) 
              },
            width: 110,
            maxWidth: 110,
        },
        {
            Header: "Actions",
            accessor: "actions",
            width: 100,
            maxWidth: 100,
            sortable: false,
            Cell: record => {
            record.styles['backgroundColor'] = '#000';
            return (
              <div className="table-common-btn">
                    <Button justIcon  color="info"   onClick={() => this.handleEdit(record)}>
                    <i class="fas fa-edit"></i></Button>
                </div>
                );
              },
            }
    ]
    return (
        <GridContainer>
          {this.state.Loading === true ?
            <div className="loading">
              <SimpleBackdrop/>
            </div>
            :
           null
          }
            <GridItem xs={12}>
                <Card>
                    <CardHeader className="btn-right-outer" color="primary" icon>
                        <CardIcon color="primary">
                            <HeadsetMic />
                        </CardIcon>
                        <h4 className="margin-right-auto text-color-black">File a Claim List</h4>
                       
                      <div className="filter-wrap">
                <div
                  className="filter-top-right"
                  onMouseLeave={() => this.setState({ IsDropDownShow: false })}
                  onMouseOver={() => this.setState({ IsDropDownShow: true })}
                >
                  <Button className="cm-toggle" color="rose">
                    Claim Status <ExpandMoreIcon />
                  </Button>
                  {this.state.IsDropDownShow === true ? (
                    <div className="cm-dropdown">
                      <div className="overflow-handle">
                        {this.state.requestStatus.map((step, key) => {
                          return (
                            <li>
                              <label>
                                <input
                                  type="checkbox"
                                  checked={step.IsSelected}
                                  onChange={(e) =>
                                    this.handleCheckboxChange(
                                      e,
                                      step,
                                      step.value
                                    )
                                  }
                                />{" "}
                                {step.value}
                              </label>
                            </li>
                          );
                        })}
                      </div>
                      <div className="cms-wrap">
                        <Button
                          className="cm-search-btn"
                          color="rose"
                          onClick={() => this.searchfilter()}
                        >
                          Search
                        </Button>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
                            
                        {this.state.ReadAccess === 1 ?
                                <div className="buttonW">
                            <Button color="primary" onClick = {() => this.redirectAdd()}>Add Claim</Button>
                            </div>
                            :
                            null 
                        }
                    </CardHeader>
                    <CardBody>
                        <ReactTable
                            data={FileAClaimData}
                            filterable
                            minRows = {2}
                            defaultSorted={this.state.previousSortList}
                            defaultFiltered={this.state.previousFilterList}
                            getTheadFilterProps={(e) => this.filterProps(e)}
                            pageText = { "Total rows : " + this.state.finalLength}
                            resizable={false}
                            columns={column}
                            defaultPageSize={10}
                            getPaginationProps = {(e)=> this.checkProps(e)}
                            defaultFilterMethod={CommonConfig.filterCaseInsensitive}
                            showPaginationBottom={true}
                            className="-striped -highlight"
                        />
                    </CardBody>
                </Card>
            </GridItem>
        </GridContainer>
    );
  }
}
export default FileaClaim;