import React, { Component } from 'react';
import './App.css';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
          dataList:[],
          currentpage:1,
          popupData: {},
          popupopen:false
        };
        this.page = 1;
    };

    componentDidMount() {
        this.loadData();
    }

    loadData() {
        let page = this.page;
        //this.page += 1;
        let url = 'https://hn.algolia.com/api/v1/search_by_date?tags=story&page=' + page;
        fetch(url)
        .then(resp=> {return resp.json()})
        .then(result=>{
          let data = result.hits;
          console.log(data);
          let dataList = data && data.length > 0 ? result.hits :[];
            this.setState({dataList});
        }).catch(error=>{
          console.log(error);
        })
    }

    popupOpen(popupData){
      console.log(popupData);
      this.setState({popupData, popupopen:true});
    }

    pagiantion(){
      let i = 1;
      let page = [];
      for(i; i<=49; i++){
        page.push({value:i});
      }
      return page;
    }

    paginationdata(value){
      this.page = value;
      this.setState({currentpage: value});
      this.loadData()
    }

    searchHandler(e){
      let searcjQery = e.target.value.toLowerCase();
      if(searcjQery === ''){
        this.loadData();
        return false;
      }
      let {dataList} = this.state;
      let filterdata = dataList.filter((el) => {
          let searchTitle = el.title.toLowerCase();
          let searchAuthor = el.author.toLowerCase();
           return searchTitle.indexOf(searcjQery) !== -1 || searchAuthor.indexOf(searcjQery) !== -1;
      });
      this.setState({dataList:filterdata})
    }

    render() {
        const {dataList, popupopen, popupData} = this.state;
        const pagination = this.pagiantion();
        return (
            <div className="wrapper">
              <div className="head">
                  <div className="title">Story</div>
                  <div className="search">
                    <input type="text" placeholder="Search list" onChange={(e)=>this.searchHandler(e)}/>
                  </div>
                  <div className="filter"></div>
              </div>
              <div className="wrap_list">
                {
                  dataList && dataList.length > 0 ?
                  dataList.map((item, index) => {
                    return(
                      <div className="story_list" key={index} onClick={()=>this.popupOpen(item)}>
                        <div className="title">{item.title}</div>
                        <div className="author"><span>Author:</span> {item.author}</div>
                        <div className="created_date"><span>Date:</span> {item.created_at}</div>
                      </div>
                    )
                }):<div className="no_record">No any record</div>
                }  
              </div>
              <div className="pagination">
                  {
                    pagination && pagination.length > 0 ?
                    pagination.map((item, index) => {
                      return(
                        <div key={index} className={this.state.currentpage === item.value ? 'page active': 'page'}  onClick={()=>{this.paginationdata(item.value)}}>
                          {item.value}
                        </div>
                      )
                    }):null
                  }
              </div>
              {
                popupopen && Object.keys(popupData).length > 0 ? 
                <div className="popup">
                    <span className="overlap" onClick={()=> this.setState({popupopen: false})}></span>
                    <div className="model">
                      <span className="closebtn" onClick={()=> this.setState({popupopen: false})}>X</span>
                      <div className="popup_head">
                          {popupData.title}
                      </div>
                      <div className="publish">
                        <div><span>Author:</span> {popupData.author}</div>
                        <div><span>Publish Date:</span> {popupData.created_at}</div>
                      </div>
                      <div className="tags">
                        {
                            popupData._tags && popupData._tags.length > 0 ?
                            popupData._tags.map((item, index) => {
                              return(
                                <div className="tag" key={index}>{item}</div>
                              )
                            }): null
                        }
                      </div>
                    </div>
                </div> : null
              }
              

            </div>
        )
    }
}

export default App;