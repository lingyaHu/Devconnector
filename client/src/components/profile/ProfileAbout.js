import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

const ProfileAbout = ({
  profile: {
    bio,
    skills,
    user: { name }
  }
}) => (
  <div class='profile-about bg-light p-2'>
    {/* 如果里面有bio，就显示 */}
    {bio && (
      <Fragment>
        <h2 class='text-primary'>{name.trim().split(' ')[0]}'s Bio</h2>
        <p>{bio}</p>
        <div class='line'></div>
      </Fragment>
    )}
    <h2 class='text-primary'>Skill Set</h2>
    {skills.map((skill, index) => (
      <div key={index} className='p-1'>
        <i className='fas fa-check' /> {skill}
      </div>
    ))}
  </div>
);

ProfileAbout.propTypes = {
  profile: PropTypes.object.isRequired
};

export default ProfileAbout;