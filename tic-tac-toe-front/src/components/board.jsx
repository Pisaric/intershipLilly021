import React, { Component } from 'react';

class TicTacToeBoard extends Component {
  


  render()
  {
    return (
      <div class="container text-center">
        <div class="row row-cols-3">
          <div class="col"> X </div>
          <div class="col"> X </div>
          <div class="col"> X </div>
        </div>
        <div class="row row-cols-3">
          <div class="col">{}</div>
          <div class="col"> O </div>
          <div class="col">{}</div>
        </div>
        <div class="row row-cols-3">
          <div class="col">{}</div>
          <div class="col"> O </div>
          <div class="col">{}</div>
        </div>
      </div>
    );
  }  
}

export default TicTacToeBoard;
