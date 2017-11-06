/*
  CONGRATULATIONS on creating your first Botpress bot!

  This is the programmatic entry point of your bot.
  Your bot's logic resides here.
  
  Here's the next steps for you:
  1. Read this file to understand how this simple bot works
  2. Read the `content.yml` file to understand how messages are sent
  3. Install a connector module (Facebook Messenger and/or Slack)
  4. Customize your bot!

  Happy bot building!

  The Botpress Team
  ----
  Getting Started (Youtube Video): https://www.youtube.com/watch?v=HTpUmDz9kRY
  Documentation: https://botpress.io/docs
  Our Slack Community: https://slack.botpress.io
*/

const Converter = require('convert-units')
var data = {};

const { wordsToNumbers } = require('words-to-numbers');

var dictionary = {
  'meter': 'm',
  'meters': 'm',
  'kilometer': 'km',
  'kilometers': 'km',
  'yard': 'yd',
  'yards': 'yd',
  'inch': 'in',
  'inches': 'in',
  'centimeter': 'cm',
  'centimeters': 'cm',
  'millimeter': 'mm',
  'millimeters': 'mm',
  'foot': 'ft',
  'feet': 'ft',
  'mile': 'mi',
  'miles': 'mi',
  'milligram': 'mg',
  'milligrams': 'mg',
  'gram': 'g',
  'grams': 'g',
  'kilogram': 'kg',
  'kilograms': 'kg',
  'ounce': 'oz',
  'ounces': 'oz',
  'pound': 'lb',
  'pounds': 'lb',
  'celsius': 'C',
  'farenheight': 'F',
  'millisecond': 'ms',
  'milliseconds': 'ms',
  'second': 's',
  'seconds': 's',
  'minute': 'min',
  'minutes': 'min',
  'hour': 'h',
  'hours': 'h',
  'day': 'd',
  'days': 'd',
  'week': 'week',
  'weeks': 'week',
  'month': 'month',
  'months': 'month',
  'year': 'year',
  'years': 'year'
};

module.exports = function(bp) {
  // Listens for a first message (this is a Regex)
  // GET_STARTED is the first message you get on Facebook Messenger
  
  bp.hear({'rasa_nlu.intent.name': 'greet'}, (event) => {
    event.reply('#welcome');
  });

  bp.hear({'rasa_nlu.intent.name': 'give_name'}, (event) => {
    name = event.rasa_nlu.entities[0].value;
    event.reply('#give_name', {name: name});
  });

  bp.hear({'rasa_nlu.intent.name': 'mood_affirm'}, (event) => {
    event.reply('#affirm');
  });

  bp.hear({'rasa_nlu.intent.name': 'goodbye'}, (event) => {
    event.reply('#goodbye');
  });

  bp.hear({'rasa_nlu.intent.name': 'rude_remark'}, (event) => {
    event.reply('#rude_remark');
  });

  bp.hear({'rasa_nlu.intent.name': 'None'}, (event) => {
    event.reply('#not_understand');
  });

  bp.hear({'rasa_nlu.intent.name': 'units.convert'}, (event) => {

    data.amount = 1;
    const resultStr = convert(event.rasa_nlu.entities);

    event.reply('#unit_result', {rs: resultStr});
    
  });

  bp.hear({'rasa_nlu.intent.name': 'units.convert - context:units'}, (event) => {
    
        const resultStr = convert(event.rasa_nlu.entities);
      
        event.reply('#unit_result', {rs: resultStr});
    
    });

}




function convert(entities) {

  let from = data.from;
  let to = data.to;
  let amount = data.amount;

  
  entities.forEach(function(element) {
      if (element.entity == 'unit-from') {
          from = dictionary[element.value];
      } else if (element.entity == 'unit-to') {
          to = dictionary[element.value];
      } else if (element.entity == 'amount') {
          amount = element.value;

          if (isNaN(amount)) {
            amount = wordsToNumbers(amount);
          }

      }
  }, this);

  if (from !== undefined) {
      data.from = from;
  }

  if (to !== undefined) {
      data.to = to;
  }

  if (amount !== undefined) {
      data.amount = amount;
  } else {
      data.amount = 1;
  }

  const result = Converter(data.amount).from(data.from).to(data.to);
  let resultUnit = Converter().describe(data.to).singular;

  if (result > 1) {
    resultUnit = Converter().describe(data.to).plural;
  }
  const resultStr = result.toString() + ' ' + resultUnit;
  return resultStr;

}