import Image from 'next/image'
import React from 'react'
import grayImages from '../../json/Story images/grayscale.json'
import petImages from '../../json/Story images/pets.json'
import natureImages from '../../json/Story images/natural.json'
import patternImages from '../../json/Story images/pattern.json'
import cityImages from '../../json/Story images/city.json'

function StoryTemplates() {
  return (
    <div >
        <div>
        <p>Choose from templates</p>
        <div>
          <div>
            <p>City</p>
          </div>
          <div>
            <div>
               <p>Nature</p>
               <Image src={natureImages[0].url} width={10} alt='' height={10}/>
            </div>
          </div>
          <div>
            <p>Grayscale</p>
          </div>
          <div>
            <p>Pets</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StoryTemplates