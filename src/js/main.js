import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '../css/main.scss';
import '../css/navBar.scss'
import '../css/coursePanel.scss';
import '../css/table.scss';

import $ from 'jquery';
import 'bootstrap';

import './color_change';
import { removeTouchHoverCSSRule } from './utils';

const lastUpdate = require('../../package.json')['last-update'];

$(function() {
    // disable hover for touch screen devices
    removeTouchHoverCSSRule();

    // Setting the last updated semester
    $('#last-update').text(lastUpdate);

    $('.quick-selection .btn').click(function() {
        $(this).blur();
    });

    /**
     * Need to rework these events based on new share button
     */
    // $('header .alert-dismissible a').click(function() {
    //     ga('send', {
    //         hitType: 'event',
    //         eventCategory: 'Promotion',
    //         eventAction: 'click',
    //         eventLabel: 'GitHub',
    //     });
    // });
    // $('#shareWhatsApp a').click(function() {
    //     ga('send', {
    //         hitType: 'event',
    //         eventCategory: 'Share',
    //         eventAction: 'click',
    //         eventLabel: 'WhatsApp',
    //     });
    // });
});

// open github repo on ctrl+u
document.onkeydown = function(e) {
    if (e.ctrlKey && (e.keyCode === 117 || e.keyCode === 85)) {
        window.open('https://github.com/vatz88/FFCSonTheGo');
        return false;
    } else {
        return true;
    }
};

// Setup a listener to track Add to Homescreen events.
window.addEventListener('beforeinstallprompt', (e) => {
    ga('send', {
        hitType: 'event',
        eventCategory: 'A2H',
        eventAction: 'Seen',
        eventLabel: `A2H Shown`,
    });
    e.userChoice.then((choiceResult) => {
        ga('send', {
            hitType: 'event',
            eventCategory: 'A2H',
            eventAction: 'click',
            eventLabel: `A2H ${choiceResult.outcome}`,
        });
    });
});
let shareData = {
    title: 'FFCS On The Go',
    text: 'FFCS made hassle free!',
    url: 'https://ffcsonthego.vatz88.in',
  }
  const btn = document.getElementById('shareOther');
  btn.addEventListener('click', () => {
    navigator.share(shareData)
  });

// const Sentry = require('@sentry/browser');
// Sentry.init({
//     dsn: 'https://2108314c87344a6c9c4d1db1e82b5d05@sentry.io/1487980',
// });
