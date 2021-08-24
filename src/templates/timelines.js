import React from "react"
import { Link, graphql } from "gatsby"
import parse from "html-react-parser"

import Bio from "../components/bio"
import Layout from "../components/layout"
import Seo from "../components/seo"
import Image from "gatsby-image"

const Timeline = ({
  data,
  pageContext: { }
}) => {
  const posts = data.allWpPost.nodes
  console.log(posts)

  if (!posts.length) {
    return (
      <React.Fragment>
        <Seo title="Timelines" />
        <Bio />
        <p>
          No timeline, sowwy ;w;
        </p>
      </React.Fragment>
    )
  }

  return (
    <React.Fragment>
      <Seo title="Timelines" />
      <p>timelines hur</p>
    </React.Fragment>
  )
}

export default Timeline

export const pageQuery = graphql`
query TimelineFacts {
  allWpPost {
    nodes {  
      title    
      uri
      content
      fact_info{
        timestamp
        movie
      }      
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
