import React from "react"
import { Link, useStaticQuery, graphql } from "gatsby"
import GithubIcon from "../../content/assets/github.svg"

const Bio = () => {
  const { author } = useStaticQuery(graphql`
    query BioQuery {
      # if there was more than one user, this would need to be filtered
      author: wpUser {
        firstName
        twitter: name
        description
        avatar {
          url
        }
      }
    }
  `)
  const me = {
    name: "Abrown2644",
    github: "https://github.com/abrown2644",
    avatar: "https://avatars.githubusercontent.com/u/32423987?v=4"
  }

  const team = [
    //in future source this from wordpress and increase size of avatar by how many facts a teammate publishes and/or donations given.
    {
      name: "Frodo Baggins",
      github: "#",
      avatar: "https://i.pinimg.com/originals/3a/e5/97/3ae597ad52b0ca3b89238f5f823f3b96.png",
      dev: true,
      writer: true,
      supporter: true,
      contribution: 80
    },
    {
      name: "Sméagol",
      github: "#",
      avatar: "https://content.invisioncic.com/r252035/monthly_2020_05/Avatar-Gollum.jpg.b45439f2904ed5c229ca38b37c645169.jpg",
      dev: true,
      writer: true,
      supporter: true,
      contribution: 55
    },
    {
      name: "Gandalf",
      github: "#",
      avatar: "https://dominiquemakowski.github.io/authors/gandalf/avatar_hu26b06be530b08e9b91eb9c90bbd4ed3d_163032_270x270_fill_q90_lanczos_center.jpg",
      dev: true,
      writer: true,
      supporter: true,
      contribution: 100
    }
  ]
  const messages = {
    welcome: "<h6 class='message-entry'>One fact site to rule them all, One fact site to find them, One fact site to bring them all and on the interwebs bind them.</h6><br>May this site serve as your pocket guide to all those precious Lord of the Rings facts that no one asked you to share on movie night.. <b>Study them</b>. <b>Know them</b>.<br><br>",
    team: "Looking to join the cause and add a fact? Drop a comment on a fact or shoot me an <a href='https://www.abweb.dev' target='_blank'>email</a>. Contributors will be added below! Click the arrow to begin."
  }

  return (
    <div style={{ maxWidth: "900px", padding: "15px" }}>
      <h2 style={{ textAlign: "center", fontSize: "2.8em", fontFamily: "aniron", marginTop: "15px", textDecoration: "underline" }}>Welcome!</h2>
      <p className="message-text" dangerouslySetInnerHTML={{ __html: messages.welcome }}></p>
      <p className="message-text">Check out the <Link to={'/timelines'} className='message-link'>Movie Timeline</Link> to follow along and know exactly when Aragorn breaks his toes and exactly how many toes he broke! Along the way you'll also make everyone around you sick with disgust..you're welcome!</p>
      <br />
      <p className="message-text" dangerouslySetInnerHTML={{ __html: messages.team }}></p>
      <div className="go-go"><Link to={'/gandalf-really-did-bump-his-head-in-bag-end/'}>{'→'}</Link></div>
      <h2>Contributors</h2>
      <div className="bio">
        {me && (
          <Link target={"_blank"} to={me.github}>
            <div className={"badges"}>

            </div>
            <img
              alt={me.name}
              title={me.name}
              className="bio-avatar"
              src={me.avatar}
            />
          </Link>
        )}
        {team && (
          team.map(member => {
            return (
              <Link target={"_blank"} to={member.github}>
                <div className={"badges"}>

                </div>
                <img
                  alt={member.name}
                  title={member.name}
                  className="team-avatar"
                  style={{ maxHeight: member.contribution }}
                  src={member.avatar}
                />
              </Link>
            )
          })
        )}
      </div>
      <hr />
      <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
        <Link to={"https://github.com/abrown2644/lotr-facts"}>
          <img src={GithubIcon} height="50" />
        </Link>
      </div>
    </div>
  )
}

export default Bio
