import React from 'react'
import '../assets/style/template/TemplateCV1.scss'

function templateCV1() {
  return (
    <div className="container" id="cv-page">
        <div className="left">
          {/* Avatar */}
          <div className="image-container">
            <img
              className="image"
              src="/public/images/avatar.jpg"
              alt="Profile"
            />
          </div>
          {/* Info */}
          <div className="section bottom-left">
            <h2 className="section-title">About Me</h2>
            <p className="text">
              Motivated with 8 years of area of expertise...
            </p>
          </div>
          {/* Website & link */}
          <div className="section bottom-left">
            <h2 className="section-title">Website & Social Links</h2>
            <p className="text">Facebook: facebook.com/robinson</p>
            <p className="text">Behance: behance.net/robinson</p>
            <p className="text">Twitter: twitter.com/robinson</p>
          </div>
          {/* Reference */}
          <div className="section bottom-left">
            <h2 className="section-title">References</h2>
            <ul className="list">
              <li className="list-item">
                <p className="text">Mr. Michel Robinson</p>
                <p className="text">Graphic and Web Designer</p>
                <p className="text">+1 212-941-7824</p>
                <p className="text">info@urmailname.com</p>
              </li>
            </ul>
          </div>
          {/* Language */}
          <div className="section bottom-left">
            <h2 className="section-title">Languages</h2>
            <p className="text">English, UR Language</p>
          </div>
          {/* Addition details */}
          <div className="section bottom-left">
            <h2 className="section-title">Additional Details</h2>
            <p className="text">Driving License: Full</p>
          </div>
        </div>

        <div className="right">
          {/* Name and contact method */}
          <div className="header bottom-right">
            <div>
              <h1 className="name">Michelle Robinson</h1>
              <p className="title">Graphic Designer</p>
            </div>
            <div className="contact">
              <p className="text">14585 10th Ave, Whitestone, NY</p>
              <p className="text">+1 212-941-7824</p>
              <p className="text">info@urmailaddress.com</p>
            </div>
          </div>
          {/* Work experience */}
          <div className="section bottom-right">
            <h2 className="section-title">Work Experience</h2>
            <ul className="list">
              <li className="list-item">
                <p className="text">
                  Senior Graphic Designer at GlowPixel Ltd, Orlando (2015 -
                  2016)
                </p>
                <p className="text">
                  Customer-oriented Graphic Designer with a strong history...
                </p>
              </li>
              <li className="list-item">
                <p className="text">
                  Graphic Designer at Lorem Ipsum, New York (2014 - 2015)
                </p>
                <p className="text">
                  Customer-oriented Graphic Designer with a strong history...
                </p>
              </li>
              <li className="list-item">
                <p className="text">
                  Graphic & Web Designer at Pixelate Agency, New Jersey (2013 -
                  2014)
                </p>
                <p className="text">
                  Customer-oriented Graphic Designer with a strong history...
                </p>
              </li>
            </ul>
          </div>
          {/* Education */}
          <div className="section bottom-right">
            <h2 className="section-title">Education</h2>
            <ul className="list">
              <li className="list-item">
                <p className="text">
                  Master in Web Develop at University of UK, Toronto (2010 -
                  2012)
                </p>
                <p className="text">
                  Customer-oriented Graphic Designer with a strong history...
                </p>
              </li>
              <li className="list-item">
                <p className="text">
                  Bachelor in Graphic Design at College of Art, New Ark (2006 -
                  2010)
                </p>
                <p className="text">
                  Customer-oriented Graphic Designer with a strong history...
                </p>
              </li>
            </ul>
          </div>
          {/* Skill */}
          <div className="section bottom-right">
            <h2 className="section-title">Skills</h2>
            <div className="skills">
              <div className="skill">
                <p className="text">Adobe Photoshop</p>
                <div className="skill-bar">
                  <div className="skill-level" style={{ width: "80%" }} />
                </div>
              </div>
              <div className="skill">
                <p className="text">Adobe Illustrator</p>
                <div className="skill-bar">
                  <div className="skill-level" style={{ width: "75%" }} />
                </div>
              </div>
              <div className="skill">
                <p className="text">Adobe InDesign</p>
                <div className="skill-bar">
                  <div className="skill-level" style={{ width: "70%" }} />
                </div>
              </div>
              <div className="skill">
                <p className="text">HTML/CSS</p>
                <div className="skill-bar">
                  <div className="skill-level" style={{ width: "85%" }} />
                </div>
              </div>
              <div className="skill">
                <p className="text">WordPress</p>
                <div className="skill-bar">
                  <div className="skill-level" style={{ width: "60%" }} />
                </div>
              </div>
            </div>
          </div>
          {/* Hobbies */}
          <div className="section bottom-right">
            <h2 className="section-title">Hobbies</h2>
            <p className="text">Art, Traveling, Photography, Sports, Movie</p>
          </div>
          {/* Publication */}
          <div className="section bottom-right">
            <h2 className="section-title">Publications</h2>
            <p className="text">
              Complex cognition: The psychology of human thought, Oxford
              University Press, New York, NY, 2001
            </p>
          </div>
        </div>
      </div>
  )
}

export default templateCV1;