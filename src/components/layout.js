import React, { useState, useEffect } from "react"
import { Link, useStaticQuery, graphql } from "gatsby"
import parse from "html-react-parser"

const Layout = ({ isHomePage, children }) => {

  const [menuState, setMenuState] = useState({ show: false });

  const handleMenu = () => {
    if (menuState.show == true) {
      setMenuState({ show: false });
    }
    else {
      setMenuState({ show: true });
    }
  };

  const data = useStaticQuery(graphql`
    query LayoutQueryAndAllPosts {

      info: wp {
        generalSettings {
          title
          description
        }
      }
      posts: allWpPost(
              sort: { fields: [date], order: ASC }              
            ) {
              nodes {
                excerpt
                uri
                date(formatString: "MMMM DD, YYYY")
                title
                excerpt
                tags {
                  nodes {            
                    name
                  }
                }     
              }
            }
    }
  `)
  const posts = data.posts.nodes;

  // console.log('data: ', data);
  // console.log('posts: ', posts);

  return (
    <div className="global-wrapper" data-is-root-path={isHomePage}>
      <div className="global-header">
        <div className="header-logo">
          <Link to="/" onClick={() => { menuState.show && setMenuState({ show: false }) }}>Home</Link>
        </div>
        <div className={"menu-control " + (menuState.show ? "change" : "")} onClick={() => { handleMenu() }}>
          <div className={"bar bar1"}></div>
          <div className={"bar bar2"}></div>
          <div className={"bar bar3"}></div>
        </div>
        {menuState.show &&
          <div className="menu">
            <p>menu</p>
            <ul>
              {posts.map(post => {
                return (
                  <li>
                    <Link to={post.uri}>{post.tags.nodes[0].name}. {post.title}</Link>
                  </li>
                )
              })}
            </ul>
          </div>
        }
      </div>
      {/* <header className="global-header">
        {isHomePage ? (
          <h1 className="main-heading">
            <Link to="/">{parse(title)}</Link>
          </h1>
        ) : (
          <Link className="header-link-home" to="/">
            {title}
          </Link>
        )}
      </header> */}

      <main>{children}</main>

      {/* <footer>
        © {new Date().getFullYear()}, Built with
        {` `}
        <a href="https://www.gatsbyjs.com">Gatsby</a>
        {` `}
        And <a href="https://wordpress.org/">WordPress</a>
      </footer> */}
    </div>
  )
}

export default Layout