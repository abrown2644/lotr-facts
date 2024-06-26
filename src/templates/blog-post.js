import React from "react"
import { Link, graphql, navigate } from "gatsby"
import Image from "gatsby-image"
import parse from "html-react-parser"
import { useSwipeable } from 'react-swipeable';
import { Disqus } from 'gatsby-plugin-disqus';
import useWindowDimensions from '../components/hooks/windowDimensions';

import Seo from "../components/seo"

const BlogPostTemplate = ({ data: { previous, next, post } }) => {

  const { height, width } = useWindowDimensions();

  const featuredImage = {
    fluid: post.featuredImage?.node?.localFile?.childImageSharp?.fluid,
    alt: post.featuredImage?.node?.alt || ``,
  }

  //swipe
  const handlers = useSwipeable({
    onSwiped: (eventData) => {
      // console.log("User Swiped!", eventData);
      //navigate the swipe
      if (next && eventData.dir === 'Left') {
        // console.log('go right');
        navigate(next.uri);
      }
      if (previous && eventData.dir === 'Right') {
        // console.log('go left');
        navigate(previous.uri);
      }
    },
    onSwiping: (eventData) => {
      // console.log(eventData)
      // if (next && eventData.dir == 'Left') {
      //   // console.log('go right');
      //   navigate(next.uri);
      // }
      // if (previous && eventData.dir == 'Right') {
      //   // console.log('go left');
      //   navigate(previous.uri);
      // }
    }
  });

  //set fact numbers if present
  let nextNum, previousNum

  if (previous) {
    previousNum = previous.tags.nodes[0].name;
  }

  if (next) {
    nextNum = next.tags.nodes[0].name;
  }


  return (
    <React.Fragment>
      <Seo title={post.title} description={post.excerpt} />
      <div className="article-wrapper" {...handlers}>
        <article
          className="blog-post"
          itemScope
          itemType="http://schema.org/Article"
          style={{ padding: "10px" }}
        >
          <header>
            <div style={{ display: "flex", alignItems: "baseline" }}>
              <h2 itemProp="headline" className="blog-post-number">{parse(post.tags.nodes[0].name)}. </h2>
              <h5 itemProp="headline" className="blog-post-title">{parse(post.title)}</h5>
            </div>

            {/* if we have a featured image for this post let's display it */}
            {featuredImage?.fluid && (
              <div style={{
                width: '100%',
                maxWidth: '800px',
                height: '0',
                paddingBottom: '50%',  // Aspect ratio: 400px/800px = 0.5
                overflow: 'hidden',
                position: 'relative',
                marginBottom: '20px'
              }}>
                <Image
                  fluid={featuredImage.fluid}
                  alt={featuredImage.alt}
                  style={{ 
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    position: 'absolute',
                    top: '0',
                    left: '0'
                  }}
                />
              </div>
            )}
          </header>
          {post.fact_info.source &&
            <div className="fact-attribution">{<Link to={post.fact_info.source.url} target="_blank"> {post.fact_info.source.title}</Link>} </div>
          }
          <hr style={{ marginBottom: "25px" }} />
          {!!post.content && (
            <section itemProp="articleBody" className="blog-post-body">{parse(post.content)}</section>
          )}

          <Disqus style={{ paddingBottom: "100px" }} {...handlers}
            config={{
              url: 'https://lordofthefacts.coms' + post.uri,
              identifier: post.id,
              title: post.title,
            }}
          />
        </article>
      </div>

      <nav className="blog-post-nav">
        <ul
          style={{
            display: `flex`,
            flexWrap: `wrap`,
            justifyContent: `space-between`,
            listStyle: `none`,
            padding: "0 12px",
            alignItems: "center",
            boxShadow: "black 0px 1px 9px 0px",
            // minWidth: "450px"
          }}
        >
          <li style={{ fontSize: "2em", color: "black" }}>
            {previous ?
              <Link to={previous.uri + `#${previousNum}`} rel="prev" style={{ textDecoration: "none", margin: "0 80px 0 0" }}>
                ‹ {previousNum && previousNum}
              </Link>
              : width > 1025 ? <p style={{ fontSize: ".5em", margin: "0 80px 0 0", color: "white" }}>Begin</p>
                : <p style={{ fontSize: ".5em", margin: "0 80px 0 0", color: "white" }}>Swipe <span style={{ fontSize: "1.2em", margin: "0" }}> » </span> or click</p>
            }
          </li>
          {/* <p style={{ color: "white", fontFamily: "ringbearer.medium" }}>‹ swipe ›</p> */}
          <li style={{ fontSize: "2em", color: "black", margin: "0 0 0 80px" }}>
            {next ?
              <Link to={next.uri + `#${nextNum}`} rel="next" style={{ textDecoration: "none" }}>
                {nextNum && nextNum} ›
              </Link>
              : <Link to={'/'} style={{ fontSize: ".5em", margin: "0 0 0 80px", color: "white" }}>Go Home</Link>
            }
          </li>
        </ul>
      </nav>
    </React.Fragment>
  )
}

export default BlogPostTemplate

export const pageQuery = graphql`
  query BlogPostById(
    # these variables are passed in via createPage.pageContext in gatsby-node.js
    $id: String!
    $previousPostId: String
    $nextPostId: String
  ) {
    # selecting the current post by id
    post: wpPost(id: { eq: $id }) {
      id
      excerpt
      content
      title
      uri
      slug
      date(formatString: "MMMM DD, YYYY")
      tags {
        nodes {          
          name
        }
      }

      fact_info{
        timestamp
        movie
        source {
          target
          title
          url
        }
      }

      featuredImage {
        node {
          altText
          localFile {
            childImageSharp {
              fluid(maxWidth: 400, quality: 100) {
                ...GatsbyImageSharpFluid
              }
            }
          }
        }
      }
    }

    # this gets us the previous post by id (if it exists)
    previous: wpPost(id: { eq: $previousPostId }) {      
      uri
      title
      tags {
        nodes {          
          name
        }
      }
    }

    # this gets us the next post by id (if it exists)
    next: wpPost(id: { eq: $nextPostId }) {      
      uri
      title
      tags {
        nodes {          
          name
        }
      }
    }
  }
`
