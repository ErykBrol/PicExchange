import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import axios from 'axios';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import GetAppRoundedIcon from '@material-ui/icons/GetAppRounded';

const useStyles = (theme) => ({
   rightSideButtons: {
      marginLeft: 'auto',
      textDecoration: 'none',
   },
});

class FileDownloader extends Component {
   state = {
      filename: '',
   };
   handleClick = async () => {
      this.setState({ filename: this.props.filename });
      const res = await axios
         .get(`/images/${this.props.fileId}/download`, {
            params: {
               username: this.props.auth.username,
            },
            responseType: 'blob',
         })
         .catch((err) => {
            alert('You must be logged in to download images!');
         });

      const url = window.URL.createObjectURL(
         new Blob([res.data], {
            type: res.headers['content-type'],
         })
      );

      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', this.props.filename);
      document.body.appendChild(link);
      link.click();
   };

   render() {
      const { classes } = this.props;
      return (
         <Button className={classes.rightSideButtons} onClick={this.handleClick}>
            <GetAppRoundedIcon />
         </Button>
      );
   }
}

function mapStateToProps({ auth }) {
   return { auth };
}

export default compose(withStyles(useStyles), connect(mapStateToProps))(FileDownloader);
