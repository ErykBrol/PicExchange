import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import * as actions from '../actions';
import sizeMe from 'react-sizeme';
import CssBaseline from '@material-ui/core/CssBaseline';
import StackGrid from 'react-stack-grid';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

import FileDownloader from './services/FileDownloader';

class TitlebarGridList extends Component {
   componentDidMount() {
      this.props.fetchImages();
   }

   getContent() {
      const imageList = this.props.images;
      return imageList.map((tile, idx) => (
         <div key={idx}>
            <figure style={{ margin: 10 }}>
               <Card>
                  <img
                     onContextMenu={(e) => {
                        e.preventDefault();
                     }}
                     style={{ width: '100%', height: 'auto', margin: 'auto' }}
                     src={`https://pic-exchange-demo.herokuapp.com/${tile.filename}`}
                     alt={'placeholder'}
                  />{' '}
                  <div style={{ padding: '5px' }}>
                     <CardActions>
                        <Typography gutterBottom variant="h6">
                           <Box style={{ marginRight: '4px' }} fontSize="fontSize" fontWeight="fontWeightLight" m={1}>
                              by:
                           </Box>
                        </Typography>
                        <Typography gutterBottom variant="h6" style={{ marginLeft: 0, marginRight: 'auto' }}>
                           <Box fontStyle="italic" m={1} fontWeight="fontWeightLight" style={{ margin: 0 }}>
                              {tile.uploader.username}
                           </Box>
                        </Typography>
                        <FileDownloader fileId={tile._id} filename={tile.filename} />
                     </CardActions>
                  </div>
               </Card>
            </figure>
         </div>
      ));
   }

   render() {
      const {
         size: { width },
      } = this.props;
      let colWidth = '33.33%';
      if (width <= 768) colWidth = '50%';
      if (width <= 450) colWidth = '80%';

      return (
         <div style={{ width: '80%', margin: 'auto' }}>
            <CssBaseline />
            <StackGrid monitorImagesLoaded={true} columnWidth={colWidth}>
               {this.getContent()}
            </StackGrid>
         </div>
      );
   }
}

function mapStateToProps({ images }) {
   return { images };
}

export default compose(sizeMe(), connect(mapStateToProps, actions))(TitlebarGridList);
