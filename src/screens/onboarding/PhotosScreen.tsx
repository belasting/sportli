import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { OnboardingStackParamList } from '../../types';
import { OnboardingLayout } from '../../components/onboarding/OnboardingLayout';
import { useOnboarding } from '../../context/OnboardingContext';

type Props = {
  navigation: NativeStackNavigationProp<OnboardingStackParamList, 'Photos'>;
};

const { width } = Dimensions.get('window');
const SLOT_SIZE = (width - 48 - 24 - 12) / 3;
const MAX_PHOTOS = 6;

export const PhotosScreen: React.FC<Props> = ({ navigation }) => {
  const { data, update } = useOnboarding();
  const [photos, setPhotos] = useState<string[]>(data.photos);

  const pickPhoto = useCallback(async (index: number) => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please allow access to your photo library.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 5],
      quality: 0.85,
    });

    if (!result.canceled && result.assets[0]) {
      const uri = result.assets[0].uri;
      setPhotos(prev => {
        const next = [...prev];
        if (index < next.length) {
          next[index] = uri;
        } else {
          next.push(uri);
        }
        return next;
      });
    }
  }, []);

  const removePhoto = useCallback((index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  }, []);

  const handleContinue = () => {
    update({ photos });
    navigation.navigate('City');
  };

  return (
    <OnboardingLayout
      title="Add some pictures"
      subtitle="Preferably where you do sports — show your best self"
      step={7}
      onBack={() => navigation.goBack()}
      onContinue={handleContinue}
      continueLabel={photos.length === 0 ? 'Skip' : 'Continue'}
    >
      <View style={styles.grid}>
        {Array.from({ length: MAX_PHOTOS }).map((_, index) => {
          const uri = photos[index];
          const isMain = index === 0;
          const hasPhoto = Boolean(uri);

          return (
            <View key={index} style={styles.slot}>
              {hasPhoto ? (
                <TouchableOpacity
                  onPress={() => pickPhoto(index)}
                  activeOpacity={0.9}
                  style={styles.photoWrap}
                >
                  <Image source={{ uri }} style={styles.photo} />
                  {isMain ? (
                    <View style={styles.mainBadge}>
                      <LinearGradient
                        colors={['#FF6B35', '#FF3CAC']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.mainGradient}
                      >
                        <Text style={styles.mainText}>Main</Text>
                      </LinearGradient>
                    </View>
                  ) : null}
                  <TouchableOpacity
                    style={styles.removeBtn}
                    onPress={() => removePhoto(index)}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Ionicons name="close-circle" size={22} color="#fff" />
                  </TouchableOpacity>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() => pickPhoto(photos.length)}
                  activeOpacity={0.7}
                  style={[
                    styles.emptySlot,
                    isMain && styles.emptySlotMain,
                    index > photos.length && styles.emptySlotDisabled,
                  ]}
                  disabled={index > photos.length}
                >
                  <Ionicons
                    name={isMain ? 'camera-outline' : 'add'}
                    size={isMain ? 28 : 24}
                    color={
                      isMain
                        ? '#FF6B35'
                        : index > photos.length
                        ? 'rgba(255,255,255,0.15)'
                        : 'rgba(255,255,255,0.40)'
                    }
                  />
                  {isMain ? (
                    <Text style={styles.mainHint}>Main photo</Text>
                  ) : null}
                </TouchableOpacity>
              )}
            </View>
          );
        })}
      </View>

      <Text style={styles.hint}>
        Tap a photo to replace it. The first photo is your main profile picture.
      </Text>
    </OnboardingLayout>
  );
};

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  slot: {
    width: SLOT_SIZE,
    height: SLOT_SIZE * 1.25,
  },
  photoWrap: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  photo: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
  },
  mainBadge: {
    position: 'absolute',
    bottom: 6,
    left: 6,
  },
  mainGradient: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  mainText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#fff',
  },
  removeBtn: {
    position: 'absolute',
    top: 6,
    right: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
  emptySlot: {
    flex: 1,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.12)',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  emptySlotMain: {
    borderColor: 'rgba(255,107,53,0.45)',
    backgroundColor: 'rgba(255,107,53,0.06)',
  },
  emptySlotDisabled: {
    opacity: 0.4,
  },
  mainHint: {
    fontSize: 11,
    fontWeight: '600',
    color: 'rgba(255,107,53,0.8)',
  },
  hint: {
    marginTop: 16,
    fontSize: 12,
    color: 'rgba(255,255,255,0.30)',
    textAlign: 'center',
    lineHeight: 18,
  },
});
