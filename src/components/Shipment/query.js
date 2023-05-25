                let query = '';
                let StatusQuery = '';
                for(var j = 0;j < value.length;j++){
                    if(j === 0){
                        if(value.length === 1 ){
                            StatusQuery = ` AND ( sm.ShipmentStatus = "`+value[j].value +`")`;
                        }
                        else{
                            StatusQuery = ` AND ( sm.ShipmentStatus = "`+value[j].value +`"`;
                        }
                        
                    }
                    else if(j + 1 === value.length){
                        StatusQuery = ` OR sm.ShipmentStatus = "`+value[j].value +`")`;
                    }
                    else{
                        StatusQuery = ` OR sm.ShipmentStatus = "`+value[j].value +`"`;
                    }
                    query = query + StatusQuery;
                }
                this.getShipmentList();
                this.setState({ShipmentStatus : value });

                //APi for status changes 
        try{
            
            let data
            if(!CommonConfig.isEmpty(query)){
                data = {
                    ShipmentStatus : query
                }    
            }
            this.showLoader();
            api.post("reports/getShipmentReport",data).then(res => {
                this.hideLoader();
                if(res.success){
                    this.setState({SearchList : res.data[0]});
                }
                else{
                    cogoToast.error("Something went wrong");
                }
            }).catch(err => {
                this.hideLoader();
                console.log("err",err);
            })
        }
        catch (err) {
            console.log("err",err);
        }