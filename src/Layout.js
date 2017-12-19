import React  from 'react';
import Paper from "material-ui/Paper";
import Avatar from "material-ui/Avatar";
import { teal100 } from 'material-ui/styles/colors';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import handler from "./handler";
import io from "socket.io-client";
import Snackbar from 'material-ui/Snackbar';
import $ from "jquery";

var socket = io('localhost:8080', { forceNew: true });

class Layout extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            msglist: [{
                nick: "",message: "",
                color: "",ava: ""
            }],
            userlist: [],
            open: false,
            snack: "",
            self_info: {}
        };
    }
	scrollToBottom = () => {
        this.messagesEnd.scrollIntoView(false,{ behavior: "smooth" });
    }
    componentDidMount(){
        handler();
        const nickForm = $('#setNick');
        const nickError = $('#nickError');
        const nickBox = $('#nickname');
        const nickColor = $('#color');
        const nickAvatar = $('#avatar');
        function encodeHTML(s) {
            return s.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;').replace('"', '&quot;').replace('$','&#36;');
        }
        nickForm.submit((e)=>{
            e.preventDefault();
            if(encodeHTML(nickBox.val())) {
                socket.emit('new user',{
                    "nick":encodeHTML(nickBox.val()),"color":encodeHTML(nickColor.val()),
                    "ava":encodeHTML(nickAvatar.val())
                    },
                    (flag)=>{
                        if (flag){
                            $('#nickWrap').hide();
                            $('#contentWrap').show();
							$("#inputbar-ava")[0].src = nickAvatar.val()===''?'man.ico':nickAvatar.val();
                        }
                        else {
                            nickError.html("Nickname is already taken. Try another one.");
                        }
                });
                nickBox.val(''); 
            }
            return false; 
        });
        $('#send-message').submit(function(){
            if($('#message_input').val()||$('#message_input_alt').val()) {  
                socket.emit('chat message', $('#message_input').val()||$('#message_input_alt').val());
                $('#message_input').val('');
                $('#message_input_alt').val('');
                return false;
            }
        });
        socket.on("user info",(data)=>this.setState({self_info:data}));
        socket.on('usernames',(data)=>{
            let userList = [];
            for(let i=0;i<data.nickList.length;i++){
                userList.push({
                    color:data.colorsList[i],nick:data.nickList[i],
                    status:data.statusList[i],ava:data.avatarsList[i]
                });
            }
           this.setState({userlist:userList});
        });
        socket.on('send message', (data)=>{
            let curr = this.state.msglist;
            if (curr[0].nick===""){
                curr.splice(0,1);
            }
            let received = {"nick":data.nick,"message":data.message,"color":data.color,"ava":data.ava};
            if (received.message.startsWith('*') && received.message.endsWith('*')) {
                received.message = <b>{received.message.replace(new RegExp('&ast;', 'gi'),'')}</b>
            }
            else if (received.message.startsWith('_') && received.message.endsWith('_')) {
                received.message = <i>{received.message.replace(new RegExp('_', 'gi'),'')}</i>
            }
            else if (received.message.startsWith('~') && received.message.endsWith('~')) {
                received.message = <del>{received.message.replace(new RegExp('~', 'gi'),'')}</del>
            }
            else if (received.message.startsWith('`') && received.message.endsWith('`')) {
                received.message = <code><mark style={{backgroundColor:'#7FB3D5'}}>{received.message.replace(new RegExp('`', 'gi'),'')}</mark></code>
            }
            console.log(received.message);
            curr.push(received);
			this.setState({msglist:curr});
			$('#pop_ding')[0].play()
        });
        socket.on('new connection', (msg)=>{
            this.setState({open:true,snack:msg});
            setInterval(()=>this.setState({open:false}),5000);
        });
        socket.on('bye user', (msg)=>{
            this.setState({open:true,snack:msg});
            setInterval(()=>this.setState({open:false}),5000);
        });
        socket.on('whisper', (data)=>{
            $('#feeder').append($('<strong style="color:yellow;font-style:italic;margin:40px;display:block">').text(data.nick+" whispered: "+data.message));
        });
        socket.on('custom_error', (data)=>{
            $('#feeder').append($('<strong style="color:red;font-size:small;margin:40px;display:block">').text(data));
        });
        socket.on('clear', (data)=>{
            $($('#feeder').get(0).firstChild).empty();
        });    
    }
    componentDidUpdate() {
        this.scrollToBottom();
    }
	
    render(){
        return(
            <MuiThemeProvider>
                <div id="superWrap">
                    <div id="nickWrap">
                        <h2 id="nickError" style={{color:"rgb(255, 255, 255)",marginLeft:"30%",marginTop:"10%"}}></h2>
                        <div className='form-overlay'></div>
                        <div className='icon fa fa-keyboard-o' id='form-container'>
                            <span className='icon fa fa-close' id='form-close'></span>
                            <div id='form-content'>
                            <div id='form-head'>
                                <h1 className='pre'>Enter these details:</h1>
                                <h1 className='post'>cool!</h1>
                            </div>
                            <form id="setNick">
                                <input className='input nickname' id='nickname' placeholder='Enter a nickname.' type='text' />
                                <input className='input color' placeholder='Enter a color hex code/name.' disabled={true} type='text' 
                                    style={{width:"75%",display:"inline",cursor:"default"}} />
                                <input id='color' type="color" style={{marginLeft:"10%",marginTop:"10px",height:"50px",transform:"translateY(13px)"}} />
                                <input className='input avatar' id='avatar' placeholder='Provide a link to an image to use as avatar.' type='text' />
                                <input className='input submit' type='submit' value='Done!' />
                            </form>
                            </div>
                        </div>
                    </div>  
                    <div id="contentWrap">
                        <Paper zDepth={3} className = "Feeds-Header" id= "feedsHeader"
                            style={{backgroundColor:"#000",width:"50%",height:"10%",
                            marginLeft:"50px",marginTop:"10px",position:"absolute", backgroundRepeat:"round",backgroundBlendMode:"lighten",
                            boxShadow:"5px 5px 50px #0000D5", backgroundImage:"url('starry_bg_neg.png')",border:"1px solid blue"}}>
                            <h1 style={{marginLeft:"35%",marginTop:"10px"}}>Chat Messages</h1>
                            </Paper>
                            <Paper zDepth={3} className = "Feeds-container" id="feeder"
								style={{backgroundColor:"#000",width:"50%",height:"calc(90% - 74px)", overflowY:"auto",
								marginLeft:"50px",marginTop:"80px",position:"absolute",
								boxShadow:"5px 5px 50px #D50000", backgroundImage:"url('starry_bg_std.png')",border:"1px solid red"}}>
        {/*Render Messages here.*/}
                            <div className="message wrapper">
                                {this.state.msglist.map((item,i)=>{
                                    if(item.nick==="") return null;
                                    else {
                                        return(                
                                            <div className="Messages-Container" style={{margin:"20px",marginBottom:"40px"}} key={i}>
                                                <Avatar className="avatars" size={80} src={item.ava===''?"man.ico":item.ava} style={{float:"left",marginBottom:"20px"}}/>
                                                <div className="point-container" style={{paddingTop:"25px",width:"20px", margin:"0",
                                                    display:"inline",marginLeft:"25px",height:"0"}}>
                                                    <div id="point" style={{width:"0",height:"0",marginLeft:"85px",
                                                        border:"20px solid transparent",borderRightColor:(item.color||"red"),
                                                        borderLeft:"none",borderRightWidth:"20px"}} />
                                                </div>
                                                <div className="messageText" 
                                                    style={{width:"75%",float:"right",height:"80px",
                                                        backgroundColor:"rgba(255,255,255,0.5)",marginRight:"50px",marginTop:"-55px",
                                                        borderColor:(item.color||"red"), borderWidth:"2px",borderStyle:"groove",
                                                        borderBottomLeftRadius:"10px",borderBottomRightRadius:"10px", overflowY:"auto",
                                                        borderTopLeftRadius:"10px",borderTopRightRadius:"10px", marginBottom:"25px"}}>
                                                        <p className="message" style={{height:"100%",color:(item.color||"red"),padding:"10px",wordWrap:"break-word",
                                                                borderBottomLeftRadius:"10px",borderBottomRightRadius:"10px",
                                                                borderTopLeftRadius:"10px",borderTopRightRadius:"10px",mixBlendMode: "hard-light"}}>
                                                        {item.message}
                                                        </p>
                                                </div>
                                            </div>
                                        )}
                                    }
                                )}
                            </div>        
        {/*End of Messages*/}
							<div id="auto-scroll" style={{ float:"left", clear: "both", height: "40px" }}
                                ref={(el) => { this.messagesEnd = el; }} />
                            </Paper>
                            <form id="send-message" action="">
                                <Paper zDepth={5} id = "input-container"
                                    style={{backgroundColor:"rgba(255,0,0,0.75)",width:"50%",height:"62px",
                                    marginLeft:"50px",position:"absolute",bottom:"0px",
                                    boxShadow:"5px 5px 50px #100",border:"2.5px ridge black"}}>
                                    <Avatar id="inputbar-ava" src="man.ico" style={{margin:"1%",marginLeft:"25px"}}/>
                                    <input type="text" id="message_input" style={{position:"absolute",margin:"10px",height:"35px",width:"77%",
                                    borderBottomLeftRadius:"10px",borderBottomRightRadius:"10px",
                                    borderTopRightRadius:"10px",borderTopLeftRadius:"10px", paddingLeft:"15px",
                                    backgroundColor:"rgba(0,0,0,0.75)",color:"white",
                                    fontSize:"16px"}} placeholder="Whisper: '/w {nick} message', Chat: 'message', Status: '/s status'."/>
                                    <input type="text" id="message_input_alt" style={{position:"absolute",height:"35px",width:"85%",
                                    borderBottomLeftRadius:"10px",borderBottomRightRadius:"10px", display: "none",
                                    borderTopRightRadius:"10px",borderTopLeftRadius:"10px", paddingLeft:"1px",
                                    backgroundColor:"rgba(0,0,0,0.75)",color:"white",
                                    fontSize:"16px"}} placeholder=" Whisper: /w; Status: /s."/>
                                    <button 
                                        style={{width:"25px",background:"rgba(130, 226, 255, 0)",border: "none", padding:"2px",
                                            position: "absolute",right:"95px", marginTop: "15px",cursor:"pointer"}}
                                            onMouseEnter={()=>document.getElementById("submit_icon").style="color:rgba(255,0,0,0.25)"}
                                            onMouseLeave={()=>document.getElementById("submit_icon").style="color:"+teal100}>
                                            <i className="fa fa-paper-plane fa-2x" id = "submit_icon" style={{color:teal100}}></i>
                                    </button>				 
                                </Paper>
                            </form>
                            <Paper zDepth={3} className = "Online-Header"
                            style={{backgroundColor:"#000",width:"25%",height:"10%",
                            right:"50px",marginTop:"10px",position:"absolute", backgroundRepeat:"round",backgroundBlendMode:"lighten",
                            boxShadow:"5px 5px 50px #0000D5", backgroundImage:"url('starry_bg_neg.png')",border:"1px solid blue"}}>
                            <h1 style={{marginLeft:"20%",marginTop:"10px"}}>Online: {this.state.userlist.length}</h1>
                            </Paper>
                            <Paper zDepth={3} className = "online-list"
                            style={{backgroundColor:"#000",width:"25%",height:"85%",
                            right:"50px",marginTop:"80px",position:"absolute", overflowY:"auto",
                            boxShadow:"5px 5px 50px #D50000", backgroundImage:"url('starry_bg_std.png')",border:"1px solid red"}}>
        {/*Render ulist here.*/}
                            {this.state.userlist.map((item)=>{return(                   
                                <div key={this.state.userlist.indexOf(item)} className="Users-Container" style={{margin:"20px"}}>
                                        <Avatar size={40} src={item.ava===''?"man.ico":item.ava} style={{float:"left",marginBottom:"25px"}}/>
                                        <div className="user-status" 
                                            style={{width:"75%",float:"right",height:"40px", overflowY: "auto",
                                                backgroundColor:"rgba(255,255,255,0.5)",marginRight:"10px",
                                                borderColor:(item.color||"red"), borderWidth:"2px",borderStyle:"groove",
                                                borderBottomLeftRadius:"10px",borderBottomRightRadius:"10px",
                                                borderTopLeftRadius:"10px",borderTopRightRadius:"10px", marginBottom:"25px"}}>
                                                <p style={{paddingLeft:"10px",marginTop:"0px"}}>
                                                    <strong style={{color:(item.color||"black"),marginRight:"10px"}}>
                                                        {item.nick}
                                                    </strong>
                                                    <samp style={{fontSize:"16px"}}>{item.status!==""?": "+item.status:""}</samp>
                                                </p>
                                        </div>
                                    </div>)}
                            )}
        {/*End of users list.*/}
                            </Paper>
                        </div>
                        <Snackbar
                            open={this.state.open}
                            message={this.state.snack}
                            autoHideDuration={5000} />  
						<audio id="pop_ding" src="pop_ding.mp3" />		
                </div>
            </MuiThemeProvider>
       )}
}            

export default Layout;