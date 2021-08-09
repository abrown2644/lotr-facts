import React from "react"
import { Link, graphql } from "gatsby"
import Image from "gatsby-image"
import parse from "html-react-parser"

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
        style={{ padding: "6px" }}
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
            alignItems: "center"
          }}
        >
          <li style={{ fontSize: "1.5em", color: "black" }}>
            {previous && (
              <Link to={previous.uri} rel="prev">
                ← {previousNum && previousNum}
              </Link>
            )}
          </li>

          <li style={{ fontSize: "1.5em", color: "black" }}>
            {next && (
              <Link to={next.uri} rel="next">
                {nextNum && nextNum} →
              </Link>
            )}
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
