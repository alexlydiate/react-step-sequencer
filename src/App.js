import React, { Component } from 'react';
import './App.css';
import { tones } from './tones.js';

class ToggleBtn extends Component {
  
  constructor() {
    super();
    this.state = {
      on: false,
      beating: true,
      played: false
    };
  }
  
  handleClick() {
    const newState = ! this.state.on
    this.setState({on: newState})
  }
  
  componentWillReceiveProps () {
    if (this.state.on && this.props.beating && ! this.state.played) {
      tones.play(this.props.note, this.props.octave);
      this.setState({played: true});
    }
    
    if ( ! this.props.beating && this.state.played) {
      this.setState({played: false});
    }
  }
  
  render () {
    return (
      <button className={"toggle-btn " + (this.state.on ? 'toggle-btn-on' : 'toggle-btn-off') + (this.props.beating ? ' beating' : '') + (this.props.beating && this.state.on ? ' playing' : '')} onClick={() => this.handleClick()}>
      </button>
    );
  }
}

class Machine extends Component {

  constructor() {
    super();
    
  this.startOctave = 4;
    
    this.state = {
      beats: 8,
      octaves: 1,
      startOctave: 4,
      currentBeat: null,
      lastBeat: null,
      displayBeat: null,
      tempo: 200,
      play: true,
      scale: 'major'
    };
    
    this.changeTempo = this.changeTempo.bind(this);
    this.changeBeats = this.changeBeats.bind(this);
    this.togglePlay = this.togglePlay.bind(this);
    this.changeOctaves = this.changeOctaves.bind(this);
  }
  
  renderRow(row) {
    let beats = [];

    beats.push(<div key={row} className="board-row" />);

    for (var i = 0; i < this.state.beats; i++) {
      let beating
      
      if (i === this.state.displayBeat) {
        beating = true;
      } else {
        beating = false;
      }
      
      const scale = getScale(this.state.scale, this.state.startOctave, this.state.octaves);
      
      beats.push(<ToggleBtn key={i.toString() + row.toString()} beat={i} note={scale[row][0]} octave={scale[row][1]} beating={beating} />)
    }
    
    return beats;
  }
  
  componentDidMount() {
    this.setState({currentBeat: 0});
  }
  
  componentDidUpdate() {
    if (this.state.play) {
      if (this.state.lastBeat !== this.state.currentBeat) {
        const currentBeat = this.state.currentBeat
        
        if (currentBeat + 1 < this.state.beats) {
          this.setState({currentBeat: -1, lastBeat: -1, displayBeat: currentBeat + 1});
        } else {
          this.setState({currentBeat: -1, lastBeat: -1, displayBeat: 0});
        }
        
        setTimeout(() => {
          if (currentBeat + 1 < this.state.beats) {
            this.setState({currentBeat: currentBeat + 1, lastBeat: currentBeat});
          } else {
            this.setState({currentBeat: 0, lastBeat: currentBeat});
          }
        }, 60000 / this.state.tempo);
      }
    }
  }
  
  changeTempo (e) {
    this.setState({ tempo: e.target.value });
  }
  
  changeBeats (e) {
    this.setState({ beats: e.target.value });
  }
  
  changeOctaves (e) {
    const value = parseInt(e.target.value, 10)
    this.setState({ octaves: value, startOctave: this.startOctave - value + 1 });
  }
  
  changeAttack (e) {
    tones.attack = parseInt(e.target.value, 10)
  }
  
  changeRelease (e) {
    tones.release = parseInt(e.target.value, 10)
  }
  
  togglePlay() {
    this.setState({play: ! this.state.play});
  }
  
  render () {
    
    let rows = [];
    let tempo = this.state.tempo;
    let beats = this.state.beats;
    let octaves = this.state.octaves;
    let attack = tones.attack;
    let release = tones.release;
    let type = tones.type;
    
    for (var i = 0; i < this.state.octaves * 7 + 1; i++) {
      rows.push(this.renderRow(i))
    }
    return (
      <div>
      <p>Built with React.js - thanks to the <a href="https://github.com/bit101/tones">tones</a> library which wraps the Web Audio API and provides the synth.</p>
      <p><a href="https://github.com/alexlydiate/react-step-sequencer">Source Code</a></p>
      <div id="controls">
      
        <div id="showstate">{beats} beat loop at a tempo of {tempo} bpm</div>
        <div className="control-div">
        <label htmlFor="temporange">Tempo:</label>
        <input id="temporange" type='range' value={tempo}
        min='80' max='300'
        onChange={this.changeTempo}
        step="1"
        className='col-12 dark-gray range-light control'
        />
        </div>
        
        <div className="control-div">
        <label htmlFor="temporange" >Loop length:</label>
        <input id="beatrange" type='range' value={beats}
        min='8' max='32'
        onChange={this.changeBeats}
        step="1"
        className='col-12 dark-gray range-light control'
        />
        </div>
        
        <div className="control-div">
        <label htmlFor="temporange" >Octaves:</label>
        <input id="beatrange" type='range' value={octaves}
        min='1' max='4'
        onChange={this.changeOctaves}
        step="1"
        className='col-12 dark-gray range-light control'
        />
        </div>

        <div className="control-div">
        <label htmlFor="attack" >Attack:</label>
        <input id="beatrange" type='range' value={attack}
        min='0' max='500'
        onChange={this.changeAttack}
        step="1"
        className='col-12 dark-gray range-light control'
        />
        </div>
        
        <div className="control-div">
        <label htmlFor="attack" >Release:</label>
        <input id="beatrange" type='range' value={release}
        min='0' max='500'
        onChange={this.changeRelease}
        step="1"
        className='col-12 dark-gray range-light control'
        />
        </div>

        <input id="startstop-btn" className="control" type="button" value={this.state.play ? 'Stop' : 'Play'} onClick={this.togglePlay}/>
      </div>
      <div id="keys">{rows}</div>
      </div>

    );
  }
}

class App extends Component {
  render() {
    return (
      <div className="App">
        <Machine/>
      </div>
    );
  }
}

function getScale(scale, startOctave, numOctaves) {
  scale = []
  
  for (var i=0; i <= numOctaves; i++) {
    scale.push(['c', startOctave + i]);
    scale.push(['d', startOctave + i]);
    scale.push(['e', startOctave + i]);
    scale.push(['f', startOctave + i]);
    scale.push(['g', startOctave + i]);
    scale.push(['a', startOctave + i]);
    scale.push(['b', startOctave + i]);
  }
  
  scale.push(['c', startOctave + i]);

  return scale.reverse();
}

   
// Scroll trottle:

;(function() {
    var throttle = function(type, name, obj) {
        obj = obj || window;
        var running = false;
        var func = function() {
            if (running) { return; }
            running = true;
            requestAnimationFrame(function() {
                obj.dispatchEvent(new CustomEvent(name));
                running = false;
            });
        };
        obj.addEventListener(type, func);
    };

    /* init - you can init any event */
    throttle ("scroll", "optimizedScroll");
})();

// handle event
window.addEventListener("optimizedScroll", function() {
    console.log("Resource conscious scroll callback!");
});

export default App;
