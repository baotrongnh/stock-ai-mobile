import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

const featured = [
  {
    id: 1,
    tag: 'Stock Analysis',
    type: 'video',
    title: 'GVR Quý 1/2025: Lợi nhuận tăng mạnh, dòng tiền dồi dào',
    desc: 'Phân tích chi tiết kết quả kinh doanh quý 1/2025 của GVR và triển vọng đầu tư',
    image: 'https://dummyimage.com/400x220/ddd/aaa.png&text=Video+1',
    views: 12500,
    time: '15:32',
    author: 'Đầu Tư Chứng Khoán',
    date: '2 ngày trước',
    featured: true,
  },
  {
    id: 2,
    tag: 'Market Analysis',
    type: 'video',
    title: 'Top 3 ngành hàng lớn nhất Việt Nam năm 2024 - Dựa theo tổng tài sản mới nhất',
    desc: 'Khám phá 3 ngành hàng có tổng tài sản lớn nhất tại Việt Nam và cơ hội đầu tư',
    image: 'https://dummyimage.com/400x220/ddd/aaa.png&text=Video+2',
    views: 8900,
    time: '22:45',
    author: 'Đầu Tư Chứng Khoán',
    date: '3 ngày trước',
    featured: true,
  },
  {
    id: 3,
    tag: 'Company Analysis',
    type: 'video',
    title: 'Phân tích kỹ thuật bức tranh kinh doanh của Vinamilk trong 3 năm gần đây',
    desc: 'Đánh giá toàn diện về tình hình kinh doanh và triển vọng của Vinamilk',
    image: 'https://dummyimage.com/400x220/ddd/aaa.png&text=Video+3',
    views: 15600,
    time: '18:20',
    author: 'Đầu Tư Chứng Khoán',
    date: '1 tuần trước',
    featured: true,
  },
];

const latest = [
  {
    id: 4,
    tag: 'podcast',
    type: 'podcast',
    title: 'Podcast: Đầu tư dài hạn và bí quyết thành công',
    image: 'https://dummyimage.com/400x220/222/fff.png&text=Podcast+1',
    time: '45:12',
  },
  {
    id: 5,
    tag: 'video',
    type: 'video',
    title: 'Video: Tổng quan thị trường tháng 6',
    image: 'https://dummyimage.com/400x220/222/fff.png&text=Video+4',
    time: '12:30',
  },
  {
    id: 6,
    tag: 'podcast',
    type: 'podcast',
    title: 'Podcast: Phân tích cổ phiếu tiềm năng',
    image: 'https://dummyimage.com/400x220/222/fff.png&text=Podcast+2',
    time: '38:45',
  },
];

export default function Podcast() {
  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Videos & Podcasts</Text>
        <Text style={styles.subtitle}>
          Watch expert analysis and listen to market insights from top financial professionals
        </Text>
      </View>

      {/* Search & Filter */}
      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={18} color="#aaa" style={{ marginRight: 6 }} />
          <TextInput
            placeholder="Search videos and podcasts..."
            style={styles.input}
          />
        </View>
        <TouchableOpacity style={styles.filterBtn}>
          <Text style={{ color: '#ef4444', fontWeight: 'bold' }}>Filter</Text>
        </TouchableOpacity>
      </View>

      {/* Featured Content */}
      <Text style={styles.sectionTitle}>Featured Content</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
        {featured.map(item => (
          <TouchableOpacity key={item.id} style={styles.featuredCard}>
            <Image source={{ uri: item.image }} style={styles.featuredImage} />
            {item.featured && (
              <View style={styles.featuredBadge}>
                <Text style={styles.featuredBadgeText}>Featured</Text>
              </View>
            )}
            <View style={styles.featuredContent}>
              <View style={styles.tagRow}>
                <Text style={styles.tag}>{item.tag}</Text>
                <Text style={styles.typeTag}>
                  {item.type === 'video' ? '🎬 video' : '🎧 podcast'}
                </Text>
              </View>
              <Text style={styles.featuredTitle}>{item.title}</Text>
              <Text style={styles.featuredDesc} numberOfLines={2}>{item.desc}</Text>
              <View style={styles.metaRow}>
                <Text style={styles.metaText}>👤 {item.author}</Text>
                <Text style={styles.metaDot}>·</Text>
                <Text style={styles.metaText}>👁 {item.views}</Text>
                <Text style={styles.metaDot}>·</Text>
                <Text style={styles.metaText}>{item.date}</Text>
                <Text style={styles.metaDot}>·</Text>
                <Text style={styles.metaText}><Ionicons name="time" size={13} /> {item.time}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Latest Content */}
      <Text style={styles.sectionTitle}>Latest Content</Text>
      <View style={styles.latestRow}>
        {latest.map(item => (
          <TouchableOpacity key={item.id} style={styles.latestCard}>
            <Image source={{ uri: item.image }} style={styles.latestImage} />
            <View style={styles.latestFooter}>
              <View style={styles.latestTagRow}>
                <Text style={[
                  styles.latestTag,
                  { backgroundColor: item.type === 'podcast' ? '#f3e8ff' : '#e0e7ff', color: item.type === 'podcast' ? '#a21caf' : '#2563eb' }
                ]}>
                  {item.type === 'podcast' ? '🎧 podcast' : '🎬 video'}
                </Text>
              </View>
              <Text style={styles.latestTime}><Ionicons name="time" size={13} /> {item.time}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
      <View style={{ height: 32 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  header: { padding: 20, backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#f3f4f6' },
  title: { fontSize: 22, fontWeight: 'bold', color: '#222', marginBottom: 4 },
  subtitle: { color: '#666', fontSize: 14, marginBottom: 8 },
  searchRow: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 16, marginTop: 10, marginBottom: 8 },
  searchBox: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6, elevation: 1 },
  input: { flex: 1, fontSize: 15, padding: 0 },
  filterBtn: { marginLeft: 8, paddingHorizontal: 14, paddingVertical: 7, borderRadius: 6, backgroundColor: '#fff', borderWidth: 1, borderColor: '#ef4444' },
  sectionTitle: { fontSize: 17, fontWeight: 'bold', marginHorizontal: 16, marginTop: 18, marginBottom: 8, color: '#222' },
  featuredCard: { width: 280, backgroundColor: '#fff', borderRadius: 12, marginLeft: 16, marginRight: 8, elevation: 2, overflow: 'hidden', position: 'relative' },
  featuredImage: { width: '100%', height: 120, borderTopLeftRadius: 12, borderTopRightRadius: 12 },
  featuredBadge: { position: 'absolute', top: 10, left: 10, backgroundColor: '#ef4444', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 2, zIndex: 2 },
  featuredBadgeText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
  featuredContent: { padding: 12 },
  tagRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4, gap: 6 },
  tag: { backgroundColor: '#e0e7ff', color: '#2563eb', fontSize: 11, borderRadius: 6, paddingHorizontal: 6, marginRight: 6 },
  typeTag: { backgroundColor: '#f3f4f6', color: '#222', fontSize: 11, borderRadius: 6, paddingHorizontal: 6 },
  featuredTitle: { fontWeight: 'bold', fontSize: 15, marginBottom: 2, color: '#222' },
  featuredDesc: { color: '#444', fontSize: 13, marginBottom: 8 },
  metaRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', marginTop: 2 },
  metaText: { color: '#888', fontSize: 12 },
  metaDot: { color: '#bbb', marginHorizontal: 4 },
  latestRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start', marginHorizontal: 8, marginTop: 8 },
  latestCard: { width: 160, backgroundColor: '#fff', borderRadius: 12, margin: 8, elevation: 1, overflow: 'hidden' },
  latestImage: { width: '100%', height: 80, backgroundColor: '#222' },
  latestFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 8, paddingVertical: 6 },
  latestTagRow: { flexDirection: 'row', alignItems: 'center' },
  latestTag: { fontSize: 11, borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2, fontWeight: 'bold', marginRight: 4 },
  latestTime: { color: '#888', fontSize: 12 },
});