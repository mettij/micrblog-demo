// fills the user list at the top of the page with all users in the database
// populates the drop-down menu for user selection too
// called on HTTP response
function fillUserListResponse(response): void {
  // add list elements for each user at the top of the page
  let usersList = document.getElementById("users-list");
  response.forEach(user => {
    let li = document.createElement("li");
    let a = document.createElement("a");

    a.textContent = `${user.displayname} (@${user.handle})`;
    a.href = "#";

    // make the links work
    a.onclick = () => displayPosts(user.id);

    li.appendChild(a);
    usersList.appendChild(li);
  });

  // make that "All" link work too
  document.getElementById("all-posts-link").onclick = () => displayPosts("all");


  // fill the dropdown
  let select = document.getElementById("new-post-author");
  response.forEach(user => {
    let option = document.createElement("option");

    option.value = user.id;
    option.textContent = `${user.displayname} (@${user.handle})`;

    select.appendChild(option);
  });
}

// fills the user list at the top of the page with all users in the database
// populates the drop-down menu for user selection too
// just sends the relevant HTTP request
function fillUserList(): void {
  // send an HTTP request to get all users in the table
  let http = new XMLHttpRequest();

  if (!http) {
    return;
  }

  http.onreadystatechange = function() {
    // make sure the request was successful
    if (http.readyState === XMLHttpRequest.DONE && http.status === 200) {
      fillUserListResponse(JSON.parse(http.response));
    }
  }

  http.open("GET", "users/");
  http.send();
}

// reloads the post display with the post deleted
function deletePostResponse(): void {
  // get the currently displayed posts' user id
  let postsDiv = document.getElementById("posts");
  let userID: number | "all" = "all";

  if (postsDiv.dataset.userid !== "all") {
    userID = parseInt(postsDiv.dataset.userid);
  }

  // get all the posts
  displayPosts(userID);
}

// delete the post with the given id
function deletePostWithID(postID: number): void {
  // send a DELETE request with the given post id
  let http = new XMLHttpRequest();

  if (!http) {
    return;
  }

  http.onreadystatechange = function() {
    // make sure the request was successful
    if (http.readyState === XMLHttpRequest.DONE && http.status === 200) {
      deletePostResponse();
    }
  }

  let body = JSON.stringify({
    postID: postID,
  });

  http.open("DELETE", "posts/");
  http.setRequestHeader("Content-Type", "application/json; charset=UTF-8")
  http.send(body);
}

function displayPostsResponse(response): void {
  let postsDiv = document.getElementById("posts");

  // clear the list of posts
  while (postsDiv.firstChild) {
    postsDiv.removeChild(postsDiv.firstChild);
  }

  // add the posts in order
  response.forEach(post => {
    // add a horizontal line above the post
    let hr = document.createElement("hr");
    postsDiv.appendChild(hr);

    // add the post itself
    let div = document.createElement("div");
    div.classList.add("post");

    let author = document.createElement("p");
    author.classList.add("author");
    author.textContent = `${post.displayname} (@${post.handle})`;

    let content = document.createElement("p");
    content.classList.add("content");
    content.textContent = post.content;

    let timestamp = document.createElement("p");
    timestamp.classList.add("timestamp");
    timestamp.textContent = (new Date(post.time)).toLocaleString();

    let deleteA = document.createElement("a");
    deleteA.classList.add("delete-post");
    deleteA.href = "#";
    deleteA.textContent = "Delete";
    deleteA.onclick = () => deletePostWithID(post.postid);
    timestamp.appendChild(deleteA);

    div.appendChild(author);
    div.appendChild(content);
    div.appendChild(timestamp);

    postsDiv.appendChild(div);
  });

  document.getElementById("num-posts").textContent = response.length;
}

// displays posts by the given user, or all posts
// just sends the relevant HTTP request
function displayPosts(userID: number | "all"): void {
  // send an HTTP request to get the desired posts
  let http = new XMLHttpRequest();

  if (!http) {
    return;
  }

  http.onreadystatechange = function() {
    // make sure the request was successful
    if (http.readyState === XMLHttpRequest.DONE && http.status === 200) {
      displayPostsResponse(JSON.parse(http.response));
    }
  }

  if (userID === "all") {
    // get all posts
    http.open("GET", "posts/");
  } else {
    // just get posts from the user
    http.open("GET", `posts/${userID}`);
  }

  http.send();

  let postsDiv = document.getElementById("posts");
  postsDiv.dataset.userid = userID.toString();
}

// reloads the post display with the new post
function newPostResponse(): void {
  // get the currently displayed posts' user id
  let postsDiv = document.getElementById("posts");
  let userID: number | "all" = "all";

  if (postsDiv.dataset.userid !== "all") {
    userID = parseInt(postsDiv.dataset.userid);
  }

  // get all the posts
  displayPosts(userID);
}

// sends the currently input data to the database in a new post
function newPost(): void {
  // send a POST request with the given user and content
  let http = new XMLHttpRequest();

  if (!http) {
    return;
  }

  http.onreadystatechange = function() {
    // make sure the request was successful
    if (http.readyState === XMLHttpRequest.DONE && http.status === 201) {
      newPostResponse();
    }
  }

  let authorSelect
    = document.getElementById("new-post-author") as HTMLSelectElement;
  let userID = authorSelect.options[authorSelect.selectedIndex].value;

  let contentTextArea
    = document.getElementById("new-post-content") as HTMLTextAreaElement;
  let content = contentTextArea.value;

  let body = JSON.stringify({
    userID: userID,
    content: content
  });

  http.open("POST", "posts/");
  http.setRequestHeader("Content-Type", "application/json; charset=UTF-8")
  http.send(body);

  // clear the text area
  contentTextArea.value = "";
}

// fill the page with database content
function contentLoaded(): void {
  fillUserList();
  displayPosts("all");

  document.getElementById("new-post-submit").onclick = newPost;
}

// initialize the page
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", contentLoaded);
} else {
  contentLoaded();
}
