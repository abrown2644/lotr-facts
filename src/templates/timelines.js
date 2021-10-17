import React, { useState } from "react"
import { Link, graphql } from "gatsby"
import Bio from "../components/bio"
import Seo from "../components/seo"
import Image from "gatsby-image"


/* 
rendered facts not rerendering after state array changes..find out why
*/

const Timelines = ({ data }) => {

  const posts = data.allWpPost.nodes.filter(p => { return p.fact_info.movie !== null })

  const filterFacts = (selectedMovie) => {
    let filteredArray = [];

    posts.map(post => {
      post.fact_info.movie === selectedMovie &&
        filteredArray.push(
          post
          // {
          //   key: post.id,
          //   title: post.fact_info.timestamp,
          //   cardTitle: post.title,
          //   cardSubtitle: post.fact_info.movie,
          //   cardDetailedText: post.content?.replace(/<\/?([a-z][a-z0-9]*)\b[^>]*>/gi, ''),
          //   media: {
          //     name: post.featuredImage?.node?.altText,
          //     source: {
          //       url: post.featuredImage?.node?.localFile?.childImageSharp?.fluid.src
          //     },
          //     type: "IMAGE"
          //   }
          // }
        );
    });

    return filteredArray;
  }

  const [movieState, setMovieState] = useState({
    number: 1,
    title: "The Fellowship of the Ring",
    facts: filterFacts("The Fellowship of the Ring")
  });

  const handleMovieClick = (title, number) => {
    setMovieState({ number: number, title: title, facts: filterFacts(title) })
  }

  //readmore
  const readmore = (num) => {
    // console.log(num)
    const content = document.getElementById(`content-${num}`);
    const button = document.getElementById(`button-${num}`);
    // console.log(content, button)
    if (content.style.display === "none") {
      content.style.display = "flex";
      button.innerText = "Read Less";
    } else {
      content.style.display = "none";
      button.innerText = "Read More";
    }
  }

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
      {/* <div className="bg" style={{
        // backgroundPosition: 'center',
        // backgroundAttachment: 'fixed',
        // backgroundSize: "cover",
        // backgroundImage: movieState.number === 1 ? `linear-gradient(to right,#d4ad4ea8, #ffffffdb), url(${bg1})`
        //   : movieState.number === 2 ? `linear-gradient(to right,#031908c2, #ffffffdb), url(${bg2})`
        //     : `linear-gradient(to right,#d4ad4ea8, #ffffffdb), url(${bg3})`
      }}> */}
      <div className="movie-buttons">
        <button className={movieState.number === 1 && 'bg1 selected'} onClick={() => { handleMovieClick("The Fellowship of the Ring", 1) }}><span>I</span></button>
        <button className={movieState.number === 2 && 'bg2 selected'} onClick={() => { handleMovieClick("The Two Towers", 2) }}><span>II</span></button>
        <button className={movieState.number === 3 && 'bg3 selected'} onClick={() => { handleMovieClick("The Return of the King", 3) }}><span>III</span></button>
      </div>
      <h4 className="timeline-movie-title">{movieState.title}</h4>
      {/* {movieState.facts && console.log(movieState.facts)} */}
      <div className="timeline-wrapper">
        <ul className="timeline">
          {movieState.facts &&
            movieState.facts.map((fact, i) => {
              return (
                <li className="card" key={fact.id}>
                  <div className="timestamp">
                    <p>{fact.fact_info.timestamp}</p>
                    <span>#<Link to={fact.uri}>{fact.tags.nodes[0].name}</Link></span>
                  </div>
                  <Image
                    fluid={fact.featuredImage?.node?.localFile?.childImageSharp?.fluid}
                    alt={fact.featuredImage?.node?.alt || 'image'}
                    style={{}}
                  />
                  <h5>{fact.title}</h5>
                  <h6>{fact.fact_info.movie}</h6>
                  <div className="readmore">
                    {/* <label for={`toggle-${i}`} className="non-selectable">Read More</label>
                    <input type="checkbox" id={`toggle-${i}`}></input> */}
                    <button id={`button-${i}`} onClick={() => { readmore(i) }}>Read More</button>
                  </div>
                  <p id={`content-${i}`} className="content" style={{ display: "none" }}>{fact.content?.replace(/<\/?([a-z][a-z0-9]*)\b[^>]*>/gi, '')}</p>
                </li>
              )
            })
          }
        </ul>
      </div>
      {/* </div> */}
    </React.Fragment>
  )
}

export default Timelines

export const pageQuery = graphql`
query TimelineFacts {
  allWpPost(sort: { fields: fact_info___timestamp, order: ASC }){
    nodes {  
      id
      title    
      uri
      content
      fact_info{
        timestamp
        movie
        source {
          target
          title
          url
        }
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
              fluid(maxWidth: 300, quality: 100) {
                ...GatsbyImageSharpFluid
              }
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
