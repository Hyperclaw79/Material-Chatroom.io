import React from 'react';
import {Card, CardMedia, CardHeader} from 'material-ui/Card';

class CustomCard extends React.Component {
    render(){
        return(  
            <Card style={{boxShadow:"3px 3px 5px 0px rgba(255,0,0,1)"}}>
                <CardHeader
                    title={this.props.user}
                    avatar={this.props.ava}
                    actAsExpander={true}
                    showExpandableButton={true} 
                    style={{backgroundColor:"darkred"}} />
                <CardMedia expandable={true} style={{overflow:"hidden",border:"5px groove darkred"}} 
                    mediaStyle={{paddingTop:"10px",backgroundColor:"black"}} > 
                    <iframe title="embed" src={this.props.obj}>This embed is not supported in your browser.</iframe>
                </CardMedia>
            </Card>
    )}
}

export default CustomCard;