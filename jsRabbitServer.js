
console.log("Javascript rpc server started");          

var amqp = require('amqplib/callback_api');



var replyObj1 = {name:"bow",dmg:10}
var replyObj2 = {name:"dagger",dmg:20}

var itemlist = [replyObj1,replyObj2];




amqp.connect('amqp://spring:spring@messagebroker:5672/', function(err, conn){
  //  amqp.connect("amqp://localhost", function(err, conn){  
conn.createChannel(function(err, ch) {
        //  var q = queueName;
        var queueName = "item_queue";
        var exchange = 'item';

        ch.assertExchange(exchange,'direct',{durable:true})
        ch.assertQueue(queueName, {durable:false});
        ch.bindQueue(queueName,exchange,'item_key')

        ch.prefetch(1);
        console.log('Waiting for requests');
        ch.consume(queueName, function reply(msg) {
            console.log("received message %s",msg.content);

            ch.sendToQueue(msg.properties.replyTo
                , new Buffer(JSON.stringify(itemlist))
                ,{correlationId: msg.properties.correlationId});
            ch.ack(msg);

        });
    });
});
