import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

const initialProfile = {
     firstName: 'John',
     lastName: 'Investor',
     occupation: 'Financial Analyst',
     email: 'john.investor@email.com',
     phone: '+1 (555) 123-4567',
     location: 'New York, NY',
     dob: '5/15/1990',
     bio: 'Passionate about financial markets and long-term investing. Focused on building a diversified portfolio with a mix of growth and value stocks.',
     portfolioValue: 125430,
     joined: 'January 2023',
     active: true,
};

export default function Profile() {
     const [profile, setProfile] = useState(initialProfile);
     const [tab, setTab] = useState('personal');
     const [edit, setEdit] = useState(false);
     const [editProfile, setEditProfile] = useState(profile);

     const handleSave = () => {
          setProfile(editProfile);
          setEdit(false);
     };

     return (
          <ScrollView style={styles.container}>
               {/* Header */}
               <View style={styles.headerRow}>
                    <Text style={styles.headerTitle}>User Profile</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                         {profile.active && (
                              <View style={styles.activeBadge}>
                                   <View style={styles.dotActive} />
                                   <Text style={styles.activeText}>Active</Text>
                              </View>
                         )}
                         <TouchableOpacity style={styles.editBtn} onPress={() => setEdit(!edit)}>
                              <Ionicons name={edit ? "close" : "create-outline"} size={18} color="#fff" />
                              <Text style={{ color: '#fff', fontWeight: 'bold', marginLeft: 4 }}>
                                   {edit ? 'Cancel' : 'Edit'}
                              </Text>
                         </TouchableOpacity>
                    </View>
               </View>
               <Text style={styles.subtitle}>Manage your account and preferences</Text>

               {/* Profile Card */}
               <View style={styles.profileCard}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                         <View style={styles.avatarCircle}>
                              <Ionicons name="person" size={38} color="#ef4444" />
                         </View>
                         <View style={{ marginLeft: 16 }}>
                              <Text style={styles.name}>{profile.firstName} {profile.lastName}</Text>
                              <Text style={styles.occupation}>{profile.occupation}</Text>
                              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
                                   <Ionicons name="location-outline" size={14} color="#888" />
                                   <Text style={styles.meta}>{profile.location}</Text>
                                   <Ionicons name="calendar-outline" size={14} color="#888" style={{ marginLeft: 10 }} />
                                   <Text style={styles.meta}>Joined {profile.joined}</Text>
                              </View>
                         </View>
                    </View>
               </View>

               {/* Tabs */}
               <View style={styles.tabRow}>
                    <TouchableOpacity
                         style={[styles.tabBtn, tab === 'personal' && styles.tabBtnActive]}
                         onPress={() => setTab('personal')}
                    >
                         <Ionicons name="person-outline" size={16} color={tab === 'personal' ? '#fff' : '#ef4444'} />
                         <Text style={[styles.tabText, tab === 'personal' && { color: '#fff' }]}>Personal</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                         style={[styles.tabBtn, tab === 'investment' && styles.tabBtnActive]}
                         onPress={() => setTab('investment')}
                    >
                         <MaterialIcons name="attach-money" size={16} color={tab === 'investment' ? '#fff' : '#ef4444'} />
                         <Text style={[styles.tabText, tab === 'investment' && { color: '#fff' }]}>Investment</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                         style={[styles.tabBtn, tab === 'settings' && styles.tabBtnActive]}
                         onPress={() => setTab('settings')}
                    >
                         <Ionicons name="settings-outline" size={16} color={tab === 'settings' ? '#fff' : '#ef4444'} />
                         <Text style={[styles.tabText, tab === 'settings' && { color: '#fff' }]}>Settings</Text>
                    </TouchableOpacity>
               </View>

               {/* Tab Content */}
               {tab === 'personal' && (
                    <View style={styles.infoRow}>
                         {/* Basic Info */}
                         <View style={styles.infoCard}>
                              <Text style={styles.infoTitle}><Ionicons name="person-outline" size={16} color="#ef4444" />  Basic Info</Text>
                              <View style={styles.infoFieldRow}>
                                   <Text style={styles.infoLabel}>First Name</Text>
                                   {edit ? (
                                        <TextInput
                                             style={styles.infoInput}
                                             value={editProfile.firstName}
                                             onChangeText={v => setEditProfile({ ...editProfile, firstName: v })}
                                             placeholder="First Name"
                                             placeholderTextColor="#bbb"
                                        />
                                   ) : (
                                        <Text style={styles.infoValue}>{profile.firstName}</Text>
                                   )}
                              </View>
                              <View style={styles.infoFieldRow}>
                                   <Text style={styles.infoLabel}>Last Name</Text>
                                   {edit ? (
                                        <TextInput
                                             style={styles.infoInput}
                                             value={editProfile.lastName}
                                             onChangeText={v => setEditProfile({ ...editProfile, lastName: v })}
                                             placeholder="Last Name"
                                             placeholderTextColor="#bbb"
                                        />
                                   ) : (
                                        <Text style={styles.infoValue}>{profile.lastName}</Text>
                                   )}
                              </View>
                              <View style={styles.infoFieldRow}>
                                   <Text style={styles.infoLabel}>Email</Text>
                                   {edit ? (
                                        <TextInput
                                             style={styles.infoInput}
                                             value={editProfile.email}
                                             onChangeText={v => setEditProfile({ ...editProfile, email: v })}
                                             keyboardType="email-address"
                                             placeholder="Email"
                                             placeholderTextColor="#bbb"
                                        />
                                   ) : (
                                        <Text style={styles.infoValue}><Ionicons name="mail-outline" size={14} /> {profile.email}</Text>
                                   )}
                              </View>
                              <View style={styles.infoFieldRow}>
                                   <Text style={styles.infoLabel}>Phone</Text>
                                   {edit ? (
                                        <TextInput
                                             style={styles.infoInput}
                                             value={editProfile.phone}
                                             onChangeText={v => setEditProfile({ ...editProfile, phone: v })}
                                             keyboardType="phone-pad"
                                             placeholder="Phone"
                                             placeholderTextColor="#bbb"
                                        />
                                   ) : (
                                        <Text style={styles.infoValue}><Ionicons name="call-outline" size={14} /> {profile.phone}</Text>
                                   )}
                              </View>
                              <View style={styles.infoFieldRow}>
                                   <Text style={styles.infoLabel}>Location</Text>
                                   {edit ? (
                                        <TextInput
                                             style={styles.infoInput}
                                             value={editProfile.location}
                                             onChangeText={v => setEditProfile({ ...editProfile, location: v })}
                                             placeholder="Location"
                                             placeholderTextColor="#bbb"
                                        />
                                   ) : (
                                        <Text style={styles.infoValue}><Ionicons name="location-outline" size={14} /> {profile.location}</Text>
                                   )}
                              </View>
                         </View>
                         {/* Professional Details */}
                         <View style={styles.infoCard}>
                              <Text style={styles.infoTitle}><FontAwesome5 name="briefcase" size={15} color="#ef4444" />  Professional</Text>
                              <View style={styles.infoFieldRow}>
                                   <Text style={styles.infoLabel}>Occupation</Text>
                                   {edit ? (
                                        <TextInput
                                             style={styles.infoInput}
                                             value={editProfile.occupation}
                                             onChangeText={v => setEditProfile({ ...editProfile, occupation: v })}
                                             placeholder="Occupation"
                                             placeholderTextColor="#bbb"
                                        />
                                   ) : (
                                        <Text style={styles.infoValue}>{profile.occupation}</Text>
                                   )}
                              </View>
                              <View style={styles.infoFieldRow}>
                                   <Text style={styles.infoLabel}>Date of Birth</Text>
                                   {edit ? (
                                        <TextInput
                                             style={styles.infoInput}
                                             value={editProfile.dob}
                                             onChangeText={v => setEditProfile({ ...editProfile, dob: v })}
                                             placeholder="Date of Birth"
                                             placeholderTextColor="#bbb"
                                        />
                                   ) : (
                                        <Text style={styles.infoValue}>{profile.dob}</Text>
                                   )}
                              </View>
                              <View style={styles.infoFieldRow}>
                                   <Text style={styles.infoLabel}>Bio</Text>
                                   {edit ? (
                                        <TextInput
                                             style={[styles.infoInput, { height: 60 }]}
                                             value={editProfile.bio}
                                             onChangeText={v => setEditProfile({ ...editProfile, bio: v })}
                                             multiline
                                             placeholder="Bio"
                                             placeholderTextColor="#bbb"
                                        />
                                   ) : (
                                        <Text style={styles.infoValue}>{profile.bio}</Text>
                                   )}
                              </View>
                         </View>
                    </View>
               )}

               {/* Save Button */}
               {edit && (
                    <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                         <Ionicons name="checkmark-circle" size={18} color="#fff" />
                         <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16, marginLeft: 6 }}>Save</Text>
                    </TouchableOpacity>
               )}

               {/* Investment Profile & Settings tabs placeholder */}
               {tab === 'investment' && (
                    <View style={styles.placeholderTab}>
                         <MaterialIcons name="attach-money" size={32} color="#ef4444" style={{ marginBottom: 8 }} />
                         <Text style={{ color: '#888', fontSize: 16 }}>Investment Profile coming soon...</Text>
                    </View>
               )}
               {tab === 'settings' && (
                    <View style={styles.placeholderTab}>
                         <Ionicons name="settings-outline" size={32} color="#ef4444" style={{ marginBottom: 8 }} />
                         <Text style={{ color: '#888', fontSize: 16 }}>Settings coming soon...</Text>
                    </View>
               )}

               <View style={{ height: 32 }} />
          </ScrollView>
     );
}

const styles = StyleSheet.create({
     container: { flex: 1, backgroundColor: '#f9fafb' },
     headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 18, backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#f3f4f6' },
     headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#ef4444' },
     subtitle: { color: '#666', fontSize: 14, marginLeft: 18, marginBottom: 8 },
     activeBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#dcfce7', borderRadius: 12, paddingHorizontal: 8, paddingVertical: 2, marginRight: 10 },
     dotActive: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#22c55e', marginRight: 4 },
     activeText: { color: '#16a34a', fontSize: 12, fontWeight: 'bold' },
     editBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ef4444', borderRadius: 8, paddingHorizontal: 14, paddingVertical: 7, marginLeft: 8 },
     profileCard: { backgroundColor: '#fff', padding: 8, margin: 18, borderRadius: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', elevation: 3, shadowColor: '#ef4444', shadowOpacity: 0.06, shadowRadius: 8 },
     avatarCircle: { width: 62, height: 62, borderRadius: 31, backgroundColor: '#f3f4f6', alignItems: 'center', justifyContent: 'center', elevation: 1 },
     name: { fontSize: 20, fontWeight: 'bold', color: '#222' },
     occupation: { color: '#888', fontSize: 15, marginTop: 2 },
     meta: { color: '#888', fontSize: 13, marginLeft: 4 },
     portfolioValue: { color: '#22c55e', fontWeight: 'bold', fontSize: 22 },
     portfolioLabel: { color: '#888', fontSize: 13 },
     tabRow: { flexDirection: 'row', marginHorizontal: 18, marginTop: 8, marginBottom: 8, backgroundColor: '#fff', borderRadius: 14, overflow: 'hidden', elevation: 1 },
     tabBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, backgroundColor: '#fff' },
     tabBtnActive: { backgroundColor: '#ef4444' },
     tabText: { marginLeft: 6, fontWeight: 'bold', color: '#ef4444', fontSize: 15 },
     infoRow: { flexDirection: 'column', gap: 18, marginHorizontal: 18, marginTop: 8 },
     infoCard: { backgroundColor: '#fff', borderRadius: 16, padding: 18, marginBottom: 14, elevation: 2 },
     infoTitle: { fontWeight: 'bold', fontSize: 16, color: '#ef4444', marginBottom: 10 },
     infoFieldRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
     infoLabel: { width: 110, color: '#888', fontSize: 14 },
     infoValue: { color: '#222', fontSize: 14, flex: 1 },
     infoInput: { flex: 1, borderWidth: 1, borderColor: '#f3f4f6', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6, fontSize: 14, backgroundColor: '#f9fafb', color: '#222' },
     saveBtn: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginHorizontal: 18, marginTop: 12, backgroundColor: '#22c55e', borderRadius: 10, paddingVertical: 14, elevation: 2 },
     placeholderTab: { backgroundColor: '#fff', margin: 18, borderRadius: 16, padding: 40, alignItems: 'center', elevation: 1 },
});