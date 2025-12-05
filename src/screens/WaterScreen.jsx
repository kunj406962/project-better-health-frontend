import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Alert,
  Platform,
} from 'react-native';
import { Svg, Path } from 'react-native-svg';
import { GlassWater, ArrowRight } from 'lucide-react-native';
import {useAuth} from "../contexts/AuthContext"
import { API_BASE_URL } from '../config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const GOAL_GLASSES = 8;
const ML_PER_GLASS = 250;

// iPhone 16 dimensions: 390 x 844 points
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const IPHONE_16_WIDTH = 390;
const IPHONE_16_HEIGHT = 844;

export default function WaterScreen({ onBack, navigation }) {
  const {user, logout}= useAuth()
  const [glasses, setGlasses] = useState(0);
  
  const [todayEntryId, setTodayEntryId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch today's water entry
  useEffect(() => {
    fetchTodayWater();
  }, []);

  const fetchTodayWater = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('authToken');
      
      // Get all water entries
      const response = await axios.get(`${API_BASE_URL}/water`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log('Water API response:', response.data);
      
      if (response.data.success && response.data.data) {
        const waterEntries = response.data.data;
        
        // Find today's entry
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const todayEntry = waterEntries.find(entry => {
          const entryDate = new Date(entry.date);
          entryDate.setHours(0, 0, 0, 0);
          return entryDate.getTime() === today.getTime();
        });
        
        if (todayEntry) {
          console.log('Found today entry:', todayEntry);
          setGlasses(todayEntry.glasses);
          setTodayEntryId(todayEntry._id);
        } else {
          console.log('No entry found for today');
          setGlasses(0);
          setTodayEntryId(null);
        }
      } else {
        console.log('No water data available');
        setGlasses(0);
        setTodayEntryId(null);
      }
      
    } catch (error) {
      console.error('Error fetching today water:', error.response?.data || error.message);
      Alert.alert('Error', 'Failed to load water data');
      setGlasses(0);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const token = await AsyncStorage.getItem('authToken');
      
      if (todayEntryId) {
        // UPDATE existing entry
        console.log('Updating entry:', todayEntryId, 'with glasses:', glasses);
        const response = await axios.put(`${API_BASE_URL}/water/${todayEntryId}`, {
          glasses: glasses,
          notes: 'Daily water intake'
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        console.log('Update response:', response.data);
        Alert.alert('Success', 'Water intake updated!');
      } else {
        // CREATE new entry for today
        console.log('Creating new entry with glasses:', glasses);
        const response = await axios.post(`${API_BASE_URL}/water`, {
          glasses: glasses,
          notes: 'Daily water intake',
          date: new Date().toISOString()
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        console.log('Create response:', response.data);
        setTodayEntryId(response.data.data._id);
        Alert.alert('Success', 'Water intake saved!');
      }
      
    } catch (error) {
      console.error('Error saving water:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      Alert.alert('Error', error.response?.data?.message || 'Failed to save water intake');
    } finally {
      setSaving(false);
    }
  };  

  const handleIncrement = () => {
    if (glasses < GOAL_GLASSES) {
      setGlasses(glasses + 1);
    }
  };

  const handleDecrement = () => {
    if (glasses > 0) {
      setGlasses(glasses - 1);
    }
  };

  const handleQuickAdd = (amount) => {
    const newAmount = Math.min(glasses + amount, GOAL_GLASSES);
    setGlasses(newAmount);
  };

  const percentage = Math.round((glasses / GOAL_GLASSES) * 100);
  const totalMl = glasses * ML_PER_GLASS;
  const hydrationStatus = glasses === 0 ? 'Dehydrated' : glasses < 4 ? 'Low' : glasses < 8 ? 'Good' : 'Excellent';
  const statusColor = glasses === 0 ? '#e7000b' : glasses < 4 ? '#ff6900' : glasses < 8 ? '#00a63e' : '#00a63e';
  const statusBgColor = glasses === 0 ? '#fef2f2' : glasses < 4 ? '#fff7ed' : glasses < 8 ? '#f0fdf4' : '#f0fdf4';

  function WaterGlassIcon() {
    return (
      <View style={styles.waterIconContainer}>
        <GlassWater 
          size={80} 
          color="#E7000B" 
          strokeWidth={2.5}
        />
      </View>
    );
  }

  function MinusIcon() {
    return (
      <Svg width={16} height={16} viewBox="0 0 16 16">
        <Path
          d="M3.33333 8H12.6667"
          stroke="#E7000B"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.33333"
        />
      </Svg>
    );
  }

  function PlusIcon() {
    return (
      <Svg width={16} height={16} viewBox="0 0 16 16">
        <Path
          d="M3.33333 8H12.6667"
          stroke="#E7000B"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.33333"
        />
        <Path
          d="M8 3.33333V12.6667"
          stroke="#E7000B"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.33333"
        />
      </Svg>
    );
  }

  function CheckIcon() {
    return (
      <Svg width={16} height={16} viewBox="0 0 16 16">
        <Path
          d="M3.33333 8L6.66667 11.3333L12.6667 4.66667"
          stroke="white"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.33333"
        />
      </Svg>
    );
  }

  function ArrowIcon() {
    return (
      <ArrowRight 
        size={20} 
        color="#e7000b" 
        strokeWidth={2.5}
      />
    );
  }

  function CheckmarkIcon() {
    return (
      <Svg width={12} height={12} viewBox="0 0 9 7">
        <Path
          d="M8.5 0.5L3 6L0.5 3.5"
          stroke="#00A63E"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.background}>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          <View style={styles.content}>
            
            {/* Main Water Tracking Card */}
            <View style={styles.card}>
              <View style={styles.cardContent}>
                
                    {/* Water Glass Icon & Glasses Display */}
                    <View style={styles.iconSection}>
                      <View style={styles.iconWrapper}>
                        <WaterGlassIcon />
                      </View>
                  <View style={styles.glassesTextContainer}>
                    <Text style={styles.glassesNumber}>{glasses}</Text>
                    <Text style={styles.glassesLabel}>glasses</Text>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: statusBgColor }]}>
                    <Text style={[styles.statusText, { color: statusColor }]}>{hydrationStatus}</Text>
                  </View>
                </View>

                {/* Daily Progress */}
                <View style={styles.progressSection}>
                  <View style={styles.progressHeader}>
                    <Text style={styles.progressLabel}>Daily Progress</Text>
                    <Text style={styles.progressPercentage}>{percentage}%</Text>
                  </View>
                  <View style={styles.progressBarContainer}>
                    <View style={[styles.progressBarFill, { width: `${percentage}%` }]} />
                  </View>
                  <Text style={styles.goalText}>Goal: 8 glasses per day</Text>
                </View>

                {/* Manual Entry (- / + Buttons) */}
                <View style={styles.manualEntry}>
                  <TouchableOpacity
                    onPress={handleDecrement}
                    disabled={glasses === 0}
                    style={[styles.circleButton, glasses === 0 && styles.buttonDisabled]}
                  >
                    <View style={styles.buttonBorder}>
                      <View style={styles.buttonInner}>
                        <MinusIcon />
                      </View>
                    </View>
                  </TouchableOpacity>

                  <View style={styles.glassesDisplay}>
                    <Text style={styles.glassesTitle}>Glasses</Text>
                    <Text style={styles.glassesMl}>{totalMl}ml</Text>
                  </View>

                  <TouchableOpacity
                    onPress={handleIncrement}
                    disabled={glasses >= GOAL_GLASSES}
                    style={[styles.circleButton, glasses >= GOAL_GLASSES && styles.buttonDisabled]}
                  >
                    <View style={styles.buttonBorder}>
                      <View style={styles.buttonInner}>
                        <PlusIcon />
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>

                {/* Quick Add Buttons */}
                <View style={styles.quickAddSection}>
                  <Text style={styles.quickAddLabel}>Quick Add</Text>
                  <View style={styles.quickAddButtons}>
                    {[1, 2, 3, 4].map((amount) => (
                      <TouchableOpacity
                        key={amount}
                        onPress={() => handleQuickAdd(amount)}
                        disabled={glasses >= GOAL_GLASSES}
                        style={[styles.quickAddButton, glasses >= GOAL_GLASSES && styles.quickAddDisabled]}
                      >
                        <View style={styles.quickAddBorder}>
                          <Text style={styles.quickAddText}>+{amount}</Text>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

              </View>
            </View>

            {/* Today's Intake Visualization */}
            <View style={styles.card}>
              <View style={styles.cardContent}>
                <Text style={styles.intakeTitle}>Today's Intake</Text>
                <View style={styles.intakeCircles}>
                  {Array.from({ length: GOAL_GLASSES }).map((_, index) => (
                    <View
                      key={index}
                      style={[
                        styles.intakeCircle,
                        index < glasses ? styles.intakeCircleFilled : styles.intakeCircleEmpty
                      ]}
                    />
                  ))}
                </View>
              </View>
            </View>

            {/* Hydration Tips */}
            <View style={[styles.card, styles.tipsCard]}>
              <View style={styles.cardContent}>
                <Text style={styles.tipsTitle}>Hydration Tips</Text>
                <View style={styles.tipsList}>
                  {[
                    'Drink water before you feel thirsty',
                    '1 glass = approximately 250ml',
                    'Increase intake during exercise'
                  ].map((tip, index) => (
                    <View key={index} style={styles.tipItem}>
                      <View style={styles.checkmarkContainer}>
                        <CheckmarkIcon />
                      </View>
                      <Text style={styles.tipText}>{tip}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>

          </View>
        </ScrollView>
      </View>

      {/* Save Button Footer */}
      <View style={styles.footer}>
        <View style={styles.footerShadow} />
        <TouchableOpacity 
          onPress={handleSave} 
          style={styles.saveButton}
          activeOpacity={0.8}
        >
          <CheckIcon />
          <Text style={styles.saveButtonText}>Save Water Log</Text>
        </TouchableOpacity>
      </View>

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerShadow} />
        <View style={styles.headerContent}>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>Log Water</Text>
            <Text style={styles.headerSubtitle}>Track your hydration</Text>
          </View>
          <TouchableOpacity 
            onPress={(async () => {
              navigation.navigate("Login")
              await logout()
            })} 
            style={styles.backButton}
            activeOpacity={0.7}
          >
            <View style={styles.backButtonInner}>
              <ArrowIcon />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: Platform.OS === 'ios' ? IPHONE_16_WIDTH : SCREEN_WIDTH,
    height: Platform.OS === 'ios' ? IPHONE_16_HEIGHT : SCREEN_HEIGHT,
    maxWidth: IPHONE_16_WIDTH,
    maxHeight: IPHONE_16_HEIGHT,
    backgroundColor: 'white',
    position: 'relative',
    overflow: 'hidden',
    alignSelf: 'center',
  },
  background: {
    position: 'absolute',
    top: 88,
    left: 0,
    right: 0,
    bottom: 96,
    backgroundColor: '#fef2f2',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 24,
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  content: {
    gap: 24,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ffe2e2',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardContent: {
    padding: 24,
    gap: 32,
  },
  iconSection: {
    height: 188,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapper: {
    width: 112,
    height: 112,
    alignItems: 'center',
    justifyContent: 'center',
  },
  waterIconContainer: {
    width: 64,
    height: 64,
  },
  glassesTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 8,
  },
  glassesNumber: {
    fontSize: 16,
    fontWeight: '400',
    color: '#101828',
    textAlign: 'center',
  },
  glassesLabel: {
    fontSize: 16,
    fontWeight: '400',
    color: '#6a7282',
    textAlign: 'center',
  },
  statusBadge: {
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: 9999,
    marginTop: 8,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '400',
    textAlign: 'center',
  },
  progressSection: {
    gap: 8,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: '400',
    color: '#364153',
  },
  progressPercentage: {
    fontSize: 16,
    fontWeight: '400',
    color: '#e7000b',
  },
  progressBarContainer: {
    height: 12,
    backgroundColor: '#ffe2e2',
    borderRadius: 9999,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: 12,
    backgroundColor: '#dc2626',
  },
  goalText: {
    fontSize: 12,
    fontWeight: '400',
    color: '#99a1af',
  },
  manualEntry: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    height: 56,
  },
  circleButton: {
    width: 56,
    height: 56,
    borderRadius: 9999,
    backgroundColor: 'white',
  },
  buttonDisabled: {
    opacity: 0.3,
  },
  buttonBorder: {
    width: 56,
    height: 56,
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: '#ffc9c9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonInner: {
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glassesDisplay: {
    width: 80,
    alignItems: 'center',
    gap: 4,
  },
  glassesTitle: {
    fontSize: 14,
    fontWeight: '400',
    color: '#101828',
    textAlign: 'center',
  },
  glassesMl: {
    fontSize: 12,
    fontWeight: '400',
    color: '#6a7282',
    textAlign: 'center',
  },
  quickAddSection: {
    gap: 12,
  },
  quickAddLabel: {
    fontSize: 14,
    fontWeight: '400',
    color: '#364153',
  },
  quickAddButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  quickAddButton: {
    flex: 1,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'white',
  },
  quickAddDisabled: {
    opacity: 0.5,
  },
  quickAddBorder: {
    flex: 1,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ffc9c9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickAddText: {
    fontSize: 14,
    fontWeight: '400',
    color: '#364153',
  },
  intakeTitle: {
    fontSize: 18,
    fontWeight: '400',
    color: '#101828',
    marginBottom: 16,
  },
  intakeCircles: {
    flexDirection: 'row',
    gap: 8,
  },
  intakeCircle: {
    flex: 1,
    height: 30,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e5e7eb',
  },
  intakeCircleFilled: {
    backgroundColor: '#dc2626',
    borderColor: '#dc2626',
  },
  intakeCircleEmpty: {
    backgroundColor: 'white',
  },
  tipsCard: {
    backgroundColor: 'rgba(254, 242, 242, 0.5)',
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '400',
    color: '#101828',
    marginBottom: 12,
  },
  tipsList: {
    gap: 12,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  checkmarkContainer: {
    width: 20,
    height: 20,
    borderRadius: 9999,
    backgroundColor: '#dcfce7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '400',
    color: '#364153',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 96,
    backgroundColor: 'white',
    paddingTop: 12,
    paddingBottom: 20,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  footerShadow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: '#f0f0f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  saveButton: {
    height: 52,
    backgroundColor: '#e7000b',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    shadowColor: '#e7000b',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    letterSpacing: -0.2,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 88,
    backgroundColor: 'white',
    paddingTop: 8,
    paddingBottom: 12,
    paddingHorizontal: 20,
    justifyContent: 'flex-end',
  },
  headerShadow: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: '#f0f0f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 44,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1.5,
    borderColor: '#e7000b',
    shadowColor: '#e7000b',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  backButtonInner: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  headerTextContainer: {
    flex: 1,
    gap: 2,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#101828',
    letterSpacing: -0.3,
  },
  headerSubtitle: {
    fontSize: 13,
    fontWeight: '400',
    color: '#6b7280',
    letterSpacing: -0.1,
  },
});
