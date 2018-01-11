//import { setTimeout } from 'timers';


var amqp = require('amqplib/callback_api');

var queueName = "testqueue";

console.log("starting client");

amqp.connect('amqp://localhost',function(err, conn){
    conn.createChannel(function(err,ch){
        ch.assertQueue('',{exclusive:true}, function(err, q){
            var corr = Math.random().toString + Math.random();

            console.log("Sending message");

            ch.consume(q.queueName,function(msg){
                if(msg.properties.correlationId == corr){
                    console.log("Received %s", msg.content.toString());
                    setTimeout(function() {conn.close(); process.exit(0)},500);
                }
            },{noAck:true});

            ch.sendToQueue(queueName,new Buffer("Clientjs string"),{correlationId: corr, replyTo:q.queue});

        })
    })
})