import React from 'react';
import ReactDOM from 'react-dom';                                    
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

class MyForm extends React.Component {
    constructor(){                        
        super();
    		this.state = {                           
            username: "",
            usernameError:"",
            password: "",
            passwordError:""
        } 
    }
  
    onSubmit(e) {
        e.preventDefault();
        let username = this.refs.username.input.value;
      	let password = this.refs.password.input.value;
      	if(username.length  < 5 ){
                console.log(username.length);               
                this.setState({usernameError:"username cant be less than 5 charecters"});
        } 
        else if(password.length  < 5 ){
                this.setState({passwordError:"password cant be less than 5 charecters"});            
        }
        else {
            this.setState({
                username:"",
                password: "",
                usernameError:"",
                passwordError:""
            });
        }
    }
    
    render () {
      return (
        <MuiThemeProvider>
            <div> 
            <form> 
                <TextField ref="username"
                    name="username"
                    hintText="enter username/ email here"
                    floatingLabelText="user name"
                    errorText={this.state.usernameError}
                    floatingLabelFixed
                />
                <br />
                <TextField ref="password"
                    name="password"
                    hintText="enter password here"
                    floatingLabelText="pass word"
                    errorText={this.state.passwordError}
                    floatingLabelFixed
                />
                <br />
                <RaisedButton label="Submit" onClick={(e)=>this.onSubmit(e)} primary />   
            </form>
        </div>
      </MuiThemeProvider>
      );
        
      }
}
export default MyForm;
// export {Mybutton};
