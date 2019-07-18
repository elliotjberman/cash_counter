import React from 'react';
import ReactDOM from 'react-dom';
import Writer from '../components/Writer';

window.onload = function(){
    ReactDOM.render(<Writer />, document.getElementById('app'));
}
