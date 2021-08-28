import React from "react"
import { Link, graphql } from "gatsby"
import parse from "html-react-parser"

import Bio from "../components/bio"
import Layout from "../components/layout"
import Seo from "../components/seo"
import Image from "gatsby-image"
import { Chrono } from "react-chrono";

const Timeline = ({
  data,
  pageContext: { }
}) => {
  // const isBrowser = () => typeof window !== "undefined"
  const posts = data.allWpPost.nodes
  let timelinePosts = [];

  posts.map(post => {
    // console.log('img: ' + post.featuredImage?.node?.localFile?.childImageSharp?.fixed.src);
    post.fact_info.movie && timelinePosts.push(
      {
        title: post.fact_info.timestamp,
        cardTitle: post.title,
        cardSubtitle: post.fact_info.movie,
        cardDetailedText: post.content?.replace(/<\/?([a-z][a-z0-9]*)\b[^>]*>/gi, ''),
        media: {
          name: post.featuredImage?.node?.altText,
          source: {
            url: post.featuredImage?.node?.localFile?.childImageSharp?.fixed.src
          },
          type: "IMAGE"
        }
      }
    );
  });
  // console.log('posts: ', posts);

  if (!posts.length) {
    return (
      <React.Fragment>
        <Seo title="Timelines" />
        <Bio />
        <p>
          Timeline not available, sowwy ;w;
        </p>
      </React.Fragment>
    )
  }

  return (
    <React.Fragment>
      <Seo title="Timelines" />
      <p>timelines hur</p>
      <Chrono
        items={timelinePosts}
        mode="VERTICAL_ALTERNATING"
        scrollable={{ scrollbar: false }}
        theme={{
          primary: "black",
          secondary: "white",
          cardBgColor: "white",
          cardForeColor: "grey",
          titleColor: "black"
        }}
      >
      </Chrono>
    </React.Fragment>
  )
}

export default Timeline

export const pageQuery = graphql`
query TimelineFacts {
  allWpPost(sort: { fields: fact_info___timestamp, order: ASC }){
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
              fixed(width: 275, height: 275) {
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
