import React from 'react';
import ProfileMainScreen from './screens/ProfileMainScreen';
import ArtifactCollectionScreen from './screens/ArtifactCollectionScreen';
import AvatarCustomizerScreen from './screens/AvatarCustomizerScreen';
import { useNavigationStore } from '../../store/useNavigationStore';

export default function ProfileRouter() {
  const { profileSubView } = useNavigationStore();

  switch (profileSubView) {
    case 'collection':
      return <ArtifactCollectionScreen />;
    case 'avatar':
      return <AvatarCustomizerScreen />;
    case 'main':
    default:
      return <ProfileMainScreen />;
  }
}
