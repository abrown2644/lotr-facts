import React, { ReactFragment } from "react"
import { Link, graphql } from "gatsby"
import parse from "html-react-parser"

import Bio from "../components/bio"
import Layout from "../components/layout"
import Seo from "../components/seo"
import Image from "gatsby-image"

const BlogIndex = ({
  data,
  pageContext: { nextPagePath, previousPagePath, pageNumber, totalPages },
}) => {
  const posts = data.allWpPost.nodes
  // console.log(posts)

  if (!posts.length) {
    return (
      // <Layout isHomePage>
      <React.Fragment>
        <Seo title="All Facts" />
        <Bio />
        <p>
          No facts found.
        </p>
      </React.Fragment>
      // </Layout>
    )
  }

  return (
    // <Layout isHomePage>
    <React.Fragment>
      <Seo title="All Facts" />

      {/* <Bio /> */}

      <ol style={{ listStyle: `none`, margin: "0 5px", maxWidth: "1200px" }}>
        {posts.map(post => {
          const title = post.title
          const factNum = post.tags.nodes[0].name;
          const featuredImage = {
            fixed: post.featuredImage?.node?.localFile?.childImageSharp?.fixed,
            alt: post.featuredImage?.node?.alt || ``,
          }

          return (
            <li className="fact home-fact-wrapper" key={post.uri}>
              <Link to={post.uri} itemProp="url" className="home-fact">
                <div className="factNum">
                  <p>{factNum}</p>
                </div>
                {/* if we have a featured image for this post let's display it */}
                {featuredImage?.fixed && (
                  <div className="home-fact-image">
                    <Image
                      fixed={featuredImage.fixed}
                      alt={featuredImage.alt}
                      style={{ marginRight: "8px", borderRadius: "50%" }}
                    />
                  </div>
                )}
                <div style={{ display: "flex", flexFlow: "column", width: "100%" }}>
                  <h5 style={{ margin: 0 }}>

                    <span itemProp="headline">{parse(title)}</span>

                  </h5>
                  <div style={{ alignSelf: "flex-end", paddingRight: "10px", color: "gray" }}>
                    {/* &#8611; */}
                    {/* › */}
                  </div>
                </div>
              </Link>
            </li>
          )
        })}
      </ol>
      <div className="home-page-controls">
        <div style={previousPagePath ? {} : { background: "unset" }}>{previousPagePath && <Link to={previousPagePath}>‹</Link>}</div>
        {/* <div>{
          Array.from({ length: totalPages }, (_, page) => (
            <React.Fragment>

              <Link className="pageNumber" to={page === 0 ? `/` : `/facts/${page + 1}`} key={page}>{page + 1}</Link>

            </React.Fragment>
          ))}
        </div>         */}
        <div style={nextPagePath ? {} : { background: "unset" }}>{nextPagePath && <Link to={nextPagePath}>›</Link>}</div>
      </div>
    </React.Fragment>
    // </Layout>
  )
}

export default BlogIndex

export const pageQuery = graphql`
  query WordPressPostArchive($offset: Int!, $postsPerPage: Int!) {
    allWpPost(
      sort: { fields: [date], order: ASC }
      limit: $postsPerPage
      skip: $offset
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
        featuredImage {
          node {
            altText
            localFile {
              childImageSharp {
                fixed(width: 75, height: 75) {
                  ...GatsbyImageSharpFixed
                }
              }
            }
          }
        }
      }      
    }
  }
`
