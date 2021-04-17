import React from 'react';
import './App.css';
import {sample} from '../../assets/data/sample';
import {Data, Sale} from '../../utilities/interfaces/data';
import Chart from 'chart.js/auto';
import Navbar from '../../components/navbar/navbar';
// @ts-ignore
import SortableTable from 'react-sortable-table';

window.React = require('react');

interface AppData {
  data: Data;
  retailSales: number[];
  wholesaleSales: number[];
  unitsSold: number[];
  retailerMargin: number[];
}

class App extends React.Component<{}, AppData> {

  constructor(props:{}) {
    super(props);
    this.state = {
      data: sample[0],
      retailSales: [],
      wholesaleSales: [],
      unitsSold: [],
      retailerMargin: [],
    }
  }

  dateDesc = (data:Sale[], key:string) => {
    const result = data.sort((a, b) => {
      let a_dates = new Date(a.weekEnding);
      let b_dates = new Date(b.weekEnding);
      console.log(a_dates,b_dates);
      if(a_dates > b_dates) return 1;
      return -1;
    });
    return result;
  }

  dateAsc = (data:Sale[], key:string) => {
    const result = data.sort((a, b) => {
      let a_dates = new Date(a.weekEnding);
      let b_dates = new Date(b.weekEnding);
      console.log(a_dates,b_dates);
      if(a_dates < b_dates) return 1;
      return -1;
    });
    return result;
  }

  componentDidMount() {
    const ctx = document.getElementById('myChart');
    const table = document.querySelector('table');
    table?.classList.add('uk-table');
    table?.classList.add('uk-table-divider');
    table?.classList.add('uk-table-hover');
    const retailSales:number[] = [];
    const allRetailSales:number[] = [];
    let retailSalesAvg = 0;
    let retailSalesNum = 0;
    const wholesaleSales:number[] = [];
    const allWholesaleSales:number[] = [];
    let wholesaleSalesAvg = 0;
    let wholesaleSalesNum = 0;
    const unitsSold:number[] = [];
    const allUnitsSold:number[] = [];
    let unitsSoldAvg = 0;
    let unitsSoldNum = 0;
    const retailerMargin:number[] = [];
    const allRetailerMargin:number[] = [];
    let retailerMarginAvg = 0;
    let retailerMarginNum = 0;
    let currentMonth = 1;
    // assuming sales data will be in order by date
    this.state.data.sales.forEach((sale) => {
      allRetailSales.push(sale.retailSales);
      allWholesaleSales.push(sale.wholesaleSales);
      allUnitsSold.push(sale.wholesaleSales);
      allRetailerMargin.push(sale.retailerMargin);
      if(sale.weekEnding.includes(`-${currentMonth < 10 ? '0' : ''}${currentMonth}-`)) {
        retailSalesAvg += sale.retailSales;
        retailSalesNum += 1;
        wholesaleSalesAvg += sale.wholesaleSales;
        wholesaleSalesNum += 1;
        unitsSoldAvg += sale.unitsSold;
        unitsSoldNum += 1;
        retailerMarginAvg += sale.retailerMargin;
        retailerMarginNum += 1;
      }
      else {
        currentMonth += 1;
        retailSales.push(retailSalesAvg/retailSalesNum);
        wholesaleSales.push(wholesaleSalesAvg/wholesaleSalesNum);
        unitsSold.push(unitsSoldAvg/unitsSoldNum);
        retailerMargin.push(retailerMarginAvg/retailerMarginNum);
        retailSalesAvg = sale.retailSales;
        wholesaleSalesAvg = sale.wholesaleSales;
        unitsSoldAvg = sale.unitsSold;
        retailerMarginAvg = sale.retailerMargin;
        retailSalesNum = 0;
        wholesaleSalesNum = 0;
        unitsSoldNum = 0;
        retailerMarginNum = 0;
      }
    });
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'],
            datasets: [{
                label: 'Retail Sales',
                data: retailSales,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                ]
            },
            {
              label: 'Wholesale Sales',
              data: wholesaleSales,
              backgroundColor: [
                  'rgba(54, 162, 235, 0.2)',
              ],
              borderColor: [
                  'rgba(54, 162, 235, 1)',
              ]
            },
            {
              label: 'Retailer Margin',
              data: retailerMargin,
              backgroundColor: [
                  'rgba(255, 206, 86, 0.2)',
              ],
              borderColor: [
                  'rgba(255, 206, 86, 1)',
              ]
            }
          ]
        },
        options: {
          responsive: true,
          interaction: {
            mode: 'index',
            intersect: false,
          },
          stacked: false,
          plugins: {
            title: {
              display: true,
              text: 'Retail Sales'
            }
          },
          scales: {
            y: {
              type: 'linear',
              display: true,
              position: 'left',
            },
            y1: {
              type: 'linear',
              display: true,
              position: 'right',

              // grid line settings
              grid: {
                drawOnChartArea: false, // only want the grid lines for one axis to show up
              },
            },
          }
        },
    });
  }

  render() {
    const columns = [
      {
        header: 'Week Ending',
        key: 'weekEnding',
        descSortFunction: this.dateDesc,
        ascSortFunction: this.dateAsc,
      }, 
      {
        header: 'Retail Sales',
        key: 'retailSales',
      }, 
      {
        header: 'Wholesale Sales',
        key: 'wholesaleSales',
      }, 
      {
        header: 'Units Sold',
        key: 'unitsSold',
      },
      {
        header: 'Retailer Margin',
        key: 'retailerMargin',
      }];
    return (
      <>
        <Navbar/>
        <div className="uk-container">
          <div className="uk-margin-small-left uk-margin-medium-top" uk-grid="">
            <div className="uk-width-1-4 uk-card uk-card-default uk-card-body uk-padding-remove">
              <div className="uk-padding-small">
                <img alt={this.state.data.title} src={this.state.data.image}/>
                <div className="uk-text-center">
                  <p className="uk-text-bold uk-text-large uk-margin-remove">{this.state.data.title}</p>
                  <p className="uk-text-small uk-margin-remove">{this.state.data.subtitle}</p>
                </div>
              </div>
              <hr/>
              <p className="uk-padding-small uk-padding-remove-vertical">
                {
                  this.state.data.tags.map((tag, index) => <span key={index} className="uk-badge uk-margin-small-right">{tag}</span>)
                }
              </p>
              <hr/>
            </div>
            <div className="uk-width-expand">
              <div className="uk-card uk-card-default uk-card-body">
                <canvas id="myChart" style={{position: 'relative', height:'40vh'}}></canvas>
              </div>
              <div className="uk-card uk-card-default uk-card-body uk-margin-top">
                <SortableTable
                  data={this.state.data.sales}
                  columns={columns}
                  />
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default App;
