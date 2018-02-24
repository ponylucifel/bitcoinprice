import React, { Component } from 'react';
import moment from 'moment';
import './App.css';

// These dates are used for coindesk api
const ENDDATE = moment(Date.now()).add(-1, 'days').format('YYYY-MM-DD');
const STARTDATE = moment(Date.now()).add(-31, 'days').format('YYYY-MM-DD');

// This is the main component for the React app
class App extends Component {
  // set initial state
  constructor(props) {
    super(props);
    this.state = {value: '', submitted: false, currency: '', currentprice:'', history:{} };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSubmitAfterChart = this.handleSubmitAfterChart.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    // Check if input is invalid.  If it is then alert user.
    if(this.state.value.length !== 3){
      alert('Invalid input entered!');
    }
    else{
      // alert('Entered currency type: '+this.state.value.toUpperCase())
      var thisState = this;
      this.setState({'submitted': true });
      // register the currency in query and reset to blank.
      this.setState({'currency': this.state.value.toUpperCase()});
      var currency = this.state.value.toUpperCase(); 
      this.setState({'value': ''});
      
      var coindeskCurrentRate = 'https://api.coindesk.com/v1/bpi/currentprice/'
      var coindeskPriceHistory = 'https://api.coindesk.com/v1/bpi/historical/close.json?start='+ STARTDATE+'&end='+ENDDATE;
 
      coindeskPriceHistory += '&currency='+currency;
      coindeskCurrentRate += currency+'.json';

      // making get requests to coindesk api

      // a get request for current rate in a given currency
      fetch(coindeskCurrentRate)
      .then(function(response) {
        return response.json();
      })
      .then(function(data) {
        var currentRate = data['bpi'][currency]['rate'];
        thisState.setState({currentprice: currentRate});
      }).catch(function(error){
        console.log(error);
        thisState.setState({'submitted': false});
      });

      // another get request for historical data of rates in the past 30 days
      fetch(coindeskPriceHistory)
      .then(function(response) {
        return response.json();
      })
      .then(function(data) {
        console.log(data['bpi']);
        thisState.setState({history: data['bpi']});
      })
      .catch(function(error){
        console.log(error);
        thisState.setState({'submitted': false});
        alert("API error: "+ error); 
      });
    }
    event.preventDefault();
  }

  // this event handler is for back button.  It reset the app to its initial state.
  handleSubmitAfterChart(event) {
    this.setState({'submitted': false});
    event.preventDefault();
  }

  render() {
    // check if the currency was submitted or in default state and render accordingly

    // the currency has been submitted, render exchange rate
    if (this.state.submitted) {
      var history = this.state.history;
      
      // store each key from history as one long list of table row 
      var historicalRates = Object.keys(history).map(function(key, keyIndex) {
      return (
          <tr>
            <th scope="row">{keyIndex}</th>
            <td>{key}</td>
            <td>
              {/* This access the historical data obj and format data to Locale String */}
              {history[key].toLocaleString(navigator.language, { maximumFractionDigits: 2, minimumFractionDigits:2 })}
            </td>
          </tr>);
      });

      // return the current exchange rate and a historical chart on past exchange rates 
      return (
        <div class="center">Bitcoin Exchange Rate in {this.state.currency}
          <p>Current Exchange Rate: {this.state.currentprice} {this.state.currency}</p>
          <table class="table table-striped">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Date</th>
                <th scope="col">Rate</th>
              </tr>
            </thead>
            <tbody>
              {historicalRates}
            </tbody>
          </table>
          <div class="col-sm-12 center"><form class="justify-content-md-center" onSubmit={this.handleSubmitAfterChart}>
            {/* This resets the app to its initial state */}
            <input type="submit" class=" col-sm-4 btn btn-primary" value="Back"/>
          </form></div>
          
        </div> 
      );
    }

    // this is a default state
    else {
      return (
        <div class="center"><form class="col-6" onSubmit={this.handleSubmit}>
          <div class="form-group">
            <label for="currency">Enter a currency type for a bitcoin exchange rate</label>
            <input type="text" autocomplete="off" class="form-control mx-sm-3" id="currency" placeholder="Currency Type" value={this.state.value} onChange={this.handleChange} />
          </div>
          <input type="submit" class="col-sm-4 btn btn-primary" value="Submit"/>
        </form></div>
      );
    }
  }
}

export default App;
