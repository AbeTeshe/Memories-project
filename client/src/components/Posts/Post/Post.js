import React, {useState} from 'react';
import { Card, CardActions, CardContent, CardMedia, Button, Typography } from '@material-ui/core';
import {ThumbUpAlt, Delete, MoreHoriz, ThumbUpAltOutlined}  from '@material-ui/icons';
import moment from 'moment';
import { useHistory } from 'react-router';
import "./post.css";
import {useDispatch} from 'react-redux';
import { deletePost, likePost } from '../../../actions/posts';

const Post = ({post, setCurrentId}) => {
    const dispatch = useDispatch();
    const user = JSON.parse(localStorage.getItem('profile'));
    const history = useHistory();
    const [likes, setLikes] = useState(post?.likes);
    const userId = user?.result.googleId || user?.result?._id;
    const hasLikedPost = post?.likes?.find((like) => like === userId);

    const handleLike = async() => {
         dispatch(likePost(post._id));
         if(hasLikedPost) {
             setLikes(post.likes.filter((_id) => _id !==userId));
         }
         else {
             setLikes([...post.likes, userId]);
         }
    };


    const Likes = () => {
        if(likes.length > 0) {
            return likes.find((like) => like ===userId) 
            ? (
                <><ThumbUpAlt fontSize="small" />&nbsp;{likes.length > 2 ? `You add ${likes.length -1} others`: `${likes.length} like${likes.length > 1 ? 's': ''}`}</>
            ) : (
                <><ThumbUpAltOutlined fontSize="small"/>&nbsp;{likes.length}{likes.length === 1? 'Like' : 'Likes'} </>
            );
        }
        return <><ThumbUpAltOutlined fontSize="small"/>&nbsp;Like</>
    };

    const openPost = () => history.push(`/posts/${post._id}`);

    return (
        <Card className="card" raised elevation={0.5}>
            <div className="cardAction" onClick={openPost}>
                <CardMedia className="media" image={post.selectedFile} title={post.title}/>
                <div className="overlay">
                    <Typography variant="h6">{post.name}</Typography>
                    <Typography variant="body2">{moment(post.createdAt).fromNow()}</Typography>
                </div>
                {(user?.result?.googleId === post?.creator || user?.result?.creator === post?.creator) && (
                    <div className="overlay2">
                        <Button style={{color: 'white'}} size="small" 
                        onClick={(e)=>{
                            e.stopPropagation();
                            setCurrentId(post._id)}}>
                            <MoreHoriz fontSize="medium"/>
                        </Button>
                    </div>
                )}
                
                <div className="details">
                <Typography variant="body2" color="textSecondary">{post.tags.map((tag)=> `#${tag} `)}</Typography>
                </div>
                <Typography className="title" variant="h5" gutterBottom>{post.title}</Typography>
                <CardContent>
                <Typography variant="body2" color="textSecondary" component="p">{post.message.split(' ').splice(0, 20).join(' ')}...</Typography>
                </CardContent>
            </div>
            <CardActions className="cardActions">
                <Button size="small" color="primary" disabled={!user?.result} onClick={handleLike}>
                    <Likes />
                </Button>
                {user?.result && (user?.result?.name === post?.name || user?.result?.name === post?.name) && (
                    <Button size="small" color="secondary" onClick={()=> dispatch(deletePost(post._id))}>
                        <Delete fontSize="small"/>
                        &nbsp; Delete
                    </Button>
                )}
            </CardActions>
        </Card>
    );
}


export default Post;