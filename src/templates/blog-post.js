import React from "react"
import { Link, graphql, navigate } from "gatsby"
import Image from "gatsby-image"
import parse from "html-react-parser"
import { useSwipeable } from 'react-swipeable';

// We're using Gutenberg so we need the block styles
// these are copied into this project due to a conflict in the postCSS
// version used by the Gatsby and @wordpress packages that causes build
// failures.
// @todo update this once @wordpress upgrades their postcss version
import "../css/@wordpress/block-library/build-style/style.css"
import "../css/@wordpress/block-library/build-style/theme.css"

import Bio from "../components/bio"
import Layout from "../components/layout"
import Seo from "../components/seo"

const BlogPostTemplate = ({ data: { previous, next, post } }) => {
  const featuredImage = {
    fluid: post.featuredImage?.node?.localFile?.childImageSharp?.fluid,
    alt: post.featuredImage?.node?.alt || ``,
  }

  //swipe
  const handlers = useSwipeable({
    onSwiped: (eventData) => {
      // console.log("User Swiped!", eventData);
      //navigate the swipe
      if (next && eventData.dir == 'Left') {
        // console.log('go right');
        navigate(next.uri);
      }
      if (previous && eventData.dir == 'Right') {
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
    <Layout>
      <Seo title={post.title} description={post.excerpt} />

      <article
        className="blog-post"
        itemScope
        itemType="http://schema.org/Article"
        style={{ padding: "6px", height: "calc(100vh - 120px)" }}
        {...handlers}
      >
        <header>
          <div style={{ display: "flex" }}>
            <h3 itemProp="headline">{parse(post.tags.nodes[0].name)}. </h3>
            <h5 itemProp="headline">{parse(post.title)}</h5>
          </div>
          {/* <p>{post.date}</p> */}

          {/* if we have a featured image for this post let's display it */}
          {featuredImage?.fluid && (
            <Image
              fluid={featuredImage.fluid}
              alt={featuredImage.alt}
              style={{ marginBottom: 50 }}
            />
          )}
        </header>

        {!!post.content && (
          <section itemProp="articleBody">{parse(post.content)}</section>
        )}

        {/* <div {...handlers} style={{ background: "red", height: "200px", width: "100%" }}> You can swipe here </div> */}
        <hr />

        {/* <footer>
          <Bio />
        </footer> */}
      </article>

      <nav className="blog-post-nav">
        <ul
          style={{
            display: `flex`,
            flexWrap: `wrap`,
            justifyContent: `space-between`,
            listStyle: `none`,
            padding: "0",
            padding: "0 12px",
            alignItems: "center",
            boxShadow: "black 0px 1px 9px 0px"
          }}
        >
          <li style={{ fontSize: "2em", color: "black" }}>
            {previous ?
              <Link to={previous.uri} rel="prev" style={{ textDecoration: "none" }}>
                ‹ {previousNum && previousNum}
              </Link>
              : <p style={{ fontSize: ".5em", margin: "0", color: "white" }}>Swipe <span style={{ fontSize: "1.2em", margin: "0" }}> » </span> or click</p>
            }
          </li>
          {/* <p style={{ color: "white", fontFamily: "ringbearer.medium" }}>‹ swipe ›</p> */}
          <li style={{ fontSize: "2em", color: "black" }}>
            {next ?
              <Link to={next.uri} rel="next" style={{ textDecoration: "none" }}>
                {nextNum && nextNum} ›
              </Link>
              : <Link to={'/'} style={{ fontSize: ".5em", margin: "0", color: "white" }}>Go Home</Link>
            }
          </li>
        </ul>
      </nav>
    </Layout>
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
      date(formatString: "MMMM DD, YYYY")
      tags {
        nodes {          
          name
        }
      }

      featuredImage {
        node {
          altText
          localFile {
            childImageSharp {
              fluid(maxWidth: 1000, quality: 100) {
                ...GatsbyImageSharpFluid_tracedSVG
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
