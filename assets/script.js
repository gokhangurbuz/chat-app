/**
 * Created by gurbuz on 25.6.2016.
 */

(function () {

    var socket = io(document.location.hostname);

    function getName() {
       
        var name = Cookies.get('name');
        
        if(!name || name === 'null') {
            name = window.prompt("Please enter your nickname.");
            Cookies.set('name', name);
        }
        socket.emit('io:username', name);
        
        $('.message_input').focus();
        
        return name;
    }

    var Message;
    Message = function (arg) {
        this.name = arg.name, this.message = arg.message, this.datetime = arg.datetime,this.isAppend=arg.isAppend;
        this.draw = function (_this) { 
            return function () {
                var $message;
                $message = $($('.message_template').clone().html());
                $message.find('.user_name').html(_this.name + "-" + getTime(_this.datetime));
                $message.find('.text').html(_this.message);
                if(_this.isAppend)
                $('.messages').append($message);
                else
                $('.messages').prepend($message);

                return setTimeout(function () {
                    return $message.addClass('appeared');
                }, 0);
            };
        }(this);
        return this;
    };

     function getTime(timestamp) {
        var time, hours, minutes, seconds,date,month,year;
        time = new Date(timestamp);
        hours = leadZero(time.getHours());
        minutes = leadZero(time.getMinutes());
        seconds = leadZero(time.getSeconds());
        date = leadZero(time.getDate());
        month= leadZero(time.getMonth()+1);// JavaScript months are 0-11
        year = leadZero(time.getFullYear());
        return '' + hours  + ':' + minutes + ':' + seconds+' '+date+'-'+month+'-'+year+'';
    }

    function leadZero (number) {
        return (number < 10) ? '0'+number : number;
    }
    function sortDates(a, b)
    {
        return new Date(b.createdate).getTime() - new Date(a.createdate).getTime();
    }

    $(function () {

        var getMessageText, sendMessage,renderMessage,getMessageHistory,scrollToBottom;

        var initDate=new Date($.now()),dateIndex=0;
        getName();
        getMessageText = function () {
            var $message_input;
            $message_input = $('.message_input');
            return $message_input.val();
        };
        sendMessage = function (text) {
            var message;
            if (text.trim() === '') {
                return;
            }
            socket.emit('io:message', text);
        };

        renderMessage = function (text) {

            var message,$messages = $('.messages');

            var textMessage=JSON.parse(text);

            message = new Message({
                name: textMessage.name,
                message:textMessage.message,
                datetime:textMessage.datetime,
                isAppend:true
            });
            message.draw();

            $('.message_input').val('');

            return $messages.animate({ scrollTop: $messages.prop('scrollHeight') }, 300);
        };

        getMessageHistory=function (startIndex,endIndex) {
                var message;
                $.ajax({
                    type: 'GET',
                    url: '/api/getMessageHistory?startIndex='+startIndex+'&endIndex='+endIndex,
                    success: function(data) {
                        var data=JSON.parse(data).sort(sortDates);
                        $.each(data ,function (index,value) {
                            message = new Message({
                                name: value.sendername,
                                message:value.message,
                                datetime:value.createdate,
                                isAppend:false
                            });
                            message.draw();
                        });
                    }
                });
        };

        scrollToBottom= function() {
            $(window).scrollTop($('#messages').height());
        };

        window.onresize = function(){
            scrollToBottom();
        };

        socket.on('users:least', function(msg) {
            console.log(">> " +msg);
            renderMessage(msg);
            scrollToBottom();
        });

        socket.on('users:connected',function(users) { 
            console.log(">> " +users);
            $('.users').empty();
            $.each(JSON.parse(users), function( index, value ) {
                $('.users').append('<li>'+value+'</li>');
            });
        });

        socket.on('users:new', function(name) {
            $('#joiners').show();
            $('#joined').text(name)
            $('#joiners').fadeOut(5000);
        });

      
        $('.message_input').keyup(function (e) {
            if (e.which === 13) {
                return sendMessage(getMessageText());
            }
        });

        $('.send_message').click(function (e) {
            return sendMessage(getMessageText());
        });

        $('.history').click(function (e) {

            --dateIndex;
            var tempDate=initDate.getTime();
            return getMessageHistory(initDate.setDate(initDate.getDate()-3)/ 1000,tempDate/ 1000);
        });
    });
}.call(this));
