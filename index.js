import './style.css'

import { postsData } from './data.js'
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';



const postInput = document.getElementById('post-input')


document.addEventListener('click', function(e) {
    if (e.target.dataset.like) {
        handleLikeClick(e.target.dataset.like)
    } else if (e.target.dataset.retweet) {
        handleRePostClick(e.target.dataset.retweet)
    
    } else if (e.target.dataset.reply) {
        handleReplyClick(e.target.dataset.reply)

    } else if(e.target.id === 'post-btn') {
        handlePostBtnClick();
    } 
    })


function handleReplyClick(postId) {
    document.getElementById(`replies-${postId}`).classList.toggle('hidden')

    const replyButtons = document.querySelectorAll(".reply-btn");
    
    replyButtons.forEach(button => {
        button.addEventListener("click", function() {

        // Find the corresponding textarea for the reply
        const replyTextarea = document.getElementById(`reply-textarea-${postId}`);
        
        if (replyTextarea) {
            const replyText = replyTextarea.value;
            if (replyText.trim() !== "") {
                // Create a reply object
                const reply = {
                    handle: `@feelingFresh`,
                    profilePic: `/images/flower.jpeg`,
                    postText: replyText,
                }
                
                // Find the post by postId
                const post = findPostById(postId);
                if (post) {
                    post.replies.push(reply);
                    replyTextarea.value = "";
                    render();
                }
            }
        }
    });
});

}

function findPostById(postId) {
    for (let i = 0; i < postsData.length; i++) {
        if (postsData[i].uuid === postId) {
            return postsData[i];
        }
    }
    return null
}

function handlePostBtnClick() {
    postsData.unshift(
        {
        handle: `@feelingFresh`,
        profilePic: `/images/flower.jpeg`,
        likes: 0,
        reposts: 0,
        postText: `${postInput.value}`,
        replies: [],
        isLiked: false,
        isReposted: false,
        uuid: uuidv4(),
        },
    )

    render()
    postInput.value = ''
}

function handleRePostClick(postId) {
   const postSingleObj = postsData.filter(function(post) {
        return postId === post.uuid
   })[0]

   if(postSingleObj.isReposted) {
        postSingleObj.reposts--
   } else {
        postSingleObj.reposts++
   }

   postSingleObj.isReposted = !postSingleObj.isReposted

   render()
}

function handleLikeClick(postId) {
    // getting single object from data to increment/decrement the likes count
    const postSingleObj = postsData.filter(function(post) {
        return postId === post.uuid

    })[0]

    if(postSingleObj.isLiked) {
        postSingleObj.likes--
    } else {
        postSingleObj.likes++
    }

    postSingleObj.isLiked = !postSingleObj.isLiked
    render()
}

function getFeedHtml() {

    let feedHtml = ``
  
    postsData.forEach(function(post) {
        let likedClass = ""

        if(post.isLiked) {
            likedClass = 'red'
        }

        let repostClass = ""

        if(post.isReposted) {
            repostClass = "green"
        }

        let repliesHtml = ``
    
        if(post.replies.length > 0) {
            post.replies.forEach(function(reply) {
                repliesHtml += `
                <div class="post-reply">
                    <div class="post-inner">
                        <img src="${reply.profilePic}" class="profile-pic">
                        <div>
                        <p class="handle">${reply.handle}</p>
                        <p class="post-text">${reply.postText}</p>
                        </div>
                    </div>
                </div>
                `
            })
        }
        
        feedHtml += `
        <div class="post">
            <div class="post-inner">
                <img class="profile-pic" src="${post.profilePic}">
                <div>
                    <p class="handle">${post.handle}</p>
                    <p class="post-text">${post.postText}</p>
                    <div class="post-details">
                        <span class="post-detail">
                        <i class="fa-regular fa-comment-dots"
                        data-reply="${post.uuid}"
                        ></i>
                        ${post.replies.length}</span>
                        <span class="post-detail">
                        <i class="fa-solid fa-heart ${likedClass}"
                        data-like="${post.uuid}"
                        ></i>
                        ${post.likes}</span>
                        <span class="post-detail">
                        <i class="fa-solid fa-retweet ${repostClass}" 
                        data-retweet="${post.uuid}"
                        ></i>
                        ${post.reposts}</span>
                    </div>
                </div>
            </div>  
            <div class="hidden" id="replies-${post.uuid}">
                ${repliesHtml}
                <textarea id="reply-textarea-${post.uuid}" class="reply-textarea" reply-textarea"></textarea>
                <button id="reply-btn-${post.uuid}" class="reply-btn">Reply</button>
            </div>     
        </div>
        `
    })
    return feedHtml
}

function render() {
    document.getElementById('feed').innerHTML = getFeedHtml()
}

render()
