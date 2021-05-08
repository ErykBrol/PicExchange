import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import axios from 'axios';
import AddPhotoAlternateIcon from '@material-ui/icons/AddPhotoAlternate';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';

import * as actions from '../../actions';

const useStyles = (theme) => ({
   rightSideButtons: {
      textDecoration: 'none',
      color: '#FFFFFF',
   },
});

class FileUploader extends Component {
   handleInput = async (e) => {
      const selectedFile = e.target.files[0];

      const formData = new FormData();
      formData.append('image', selectedFile);
      formData.append('uploader', this.props.auth.username);

      await axios.post('/images/upload', formData);
      this.props.fetchUser();
      this.props.fetchImages();
   };

   render() {
      const { classes } = this.props;
      return (
         <label color="inherit">
            <input accept="image/*" type="file" style={{ display: 'none' }} onChange={this.handleInput} />
            <Button color="inherit" className={classes.rightSideButtons} component="span">
               <AddPhotoAlternateIcon />
            </Button>
         </label>
      );
   }
}

function mapStateToProps({ auth, images }) {
   return { auth, images };
}

export default compose(withStyles(useStyles), connect(mapStateToProps, actions))(FileUploader);
