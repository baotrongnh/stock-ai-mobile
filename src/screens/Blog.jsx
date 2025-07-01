import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getAllBlogs, getLatestBlogs, getTrendingBlogs } from '../apis/blog';

const trendingArticles = [
     {
          id: 1,
          tag: 'Investment',
          title: '🚀 Đầu Tư Tài Chính Cho Thế Hệ Tương Lai Việt Nam',
          desc: 'Khám phá những chiến lược đầu tư thông minh cho thế hệ trẻ Việt Nam trong bối cảnh kinh tế hiện đại. Từ chứng khoán đến crypto, tất cả đều có ở đây!',
          image: 'https://images.fpt.edu.vn/fpt-university.jpg',
          views: 1250,
          comments: 23,
          trending: true,
     },
     {
          id: 2,
          tag: 'Economic Policy',
          title: '💰 Fed Giữ Nguyên Lãi Suất: Cơ Hội Vàng Cho Nhà Đầu Tư',
          desc: 'Quyết định mới nhất của Fed về lãi suất và những tác động tích cực đến thị trường chứng khoán toàn cầu. Đây có phải là thời điểm vàng để đầu tư?',
          image: 'https://images.fpt.edu.vn/fpt-university.jpg',
          views: 1800,
          comments: 67,
          trending: true,
     },
     {
          id: 3,
          tag: 'Trading Strategy',
          title: '📈 Chiến Lược Trading Ngắn Hạn Cho Người Mới Bắt Đầu',
          desc: 'Hướng dẫn từ A-Z về các chiến lược trading ngắn hạn hiệu quả, phù hợp cho nhà đầu tư mới vào nghề.',
          image: 'https://images.fpt.edu.vn/fpt-university.jpg',
          views: 3200,
          comments: 89,
          trending: true,
     },
];

const latestArticles = [
     // Có thể dùng lại trendingArticles hoặc thêm mới
     ...trendingArticles,
];

export default function Blog() {
  const navigation = useNavigation();
  const [latestBlogs, setLatestBlogs] = useState([])
  const [trendingBlogs, setTrendingBlogs] = useState([])

     // Call data đây nè
     const fetchLatestBlogs = async () => {
          const data = await getLatestBlogs()
          setLatestBlogs(data.data.data)
     }

     const fetchTrendingBlogs = async () => {
          const data = await getTrendingBlogs()
          setTrendingBlogs(data.data)
     }

     useEffect(() => {
       fetchLatestBlogs()
       fetchTrendingBlogs()
     }, [])

     return (
          <ScrollView style={styles.container}>
               {/* Header */}
               <View style={styles.header}>
                    <Text style={styles.logo}>
                         <Text style={{ color: '#f59e42', fontWeight: 'bold' }}>Market Insights </Text>
                         <Text style={{ color: '#222', fontWeight: 'bold' }}>Blog</Text>
                    </Text>
                    <Text style={styles.subtitle}>Discover the latest trends, analysis, and expert opinions</Text>
               </View>

               {/* Search */}
               <View style={styles.searchBox}>
                    <TextInput
                         placeholder="Search for insights, strategies, analysis..."
                         style={styles.input}
                    />
                    <TouchableOpacity style={styles.filterBtn}>
                         <Text style={{ color: '#f59e42', fontWeight: 'bold' }}>Filter</Text>
                    </TouchableOpacity>
               </View>

               {/* Trending Now */}
               <Text style={styles.sectionTitle}>🔥 Trending Now</Text>
               <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
                    {trendingBlogs?.map(blog => (
                         <TouchableOpacity
                              key={blog.postId}
                              style={styles.card}
                              onPress={() => navigation.navigate('BlogDetail', { blogId: blog?.postId })}
                         >
                              <Image source={{ uri: blog.sourceUrl }} style={styles.cardImage} />
                              <View style={styles.cardContent}>
                                   <View style={styles.tagRow}>
                                        {blog.trending && (
                                             <Text style={styles.trendingTag}>Trending</Text>
                                        )}
                                        <Text style={styles.tag}>{blog.tag?.name}</Text>
                                   </View>
                                   <Text style={styles.cardTitle}>{blog.title}</Text>
                                   <Text style={styles.cardDesc} numberOfLines={2}>{blog.content}</Text>
                                   <View style={styles.cardFooter}>
                                        <Text style={styles.footerText}>👁 {blog.viewCount}</Text>
                                        <Text style={styles.footerText}>👍 {blog.likeCount}</Text>
                                        <Text style={styles.readMore}>Read More</Text>
                                   </View>
                              </View>
                         </TouchableOpacity>
                    ))}
               </ScrollView>

               {/* Latest Articles */}
               <Text style={styles.sectionTitle}>📚 Latest Articles</Text>
               {latestBlogs.map( blog => (
                    <TouchableOpacity
                         key={blog.postId}
                         style={styles.cardVertical}
                         onPress={() => navigation.navigate('BlogDetail', { blogId: blog.postId })}
                    >
                         <Image source={{ uri: blog.sourceUrl }} style={styles.cardImageVertical} />
                         <View style={styles.cardContentVertical}>
                              <View style={styles.tagRow}>
                                   <Text style={styles.tag}>{blog.tag.name}</Text>
                              </View>
                              <Text style={styles.cardTitle}>{blog.title}</Text>
                              <Text style={styles.cardDesc} numberOfLines={2}>{blog.content}</Text>
                              <View style={styles.cardFooter}>
                                   <Text style={styles.footerText}>👁 {blog.viewCount}</Text>
                                   <Text style={styles.footerText}>👍 {blog.likeCount}</Text>
                                   <Text style={styles.readMore}>Read More</Text>
                              </View>
                         </View>
                    </TouchableOpacity>
               ))}
               <View style={{ height: 32 }} />
          </ScrollView>
     );
}

const styles = StyleSheet.create({
     container: { flex: 1, backgroundColor: '#f9fafb' },
     header: { padding: 20, backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#f3f4f6' },
     logo: { fontSize: 24, fontWeight: 'bold', marginBottom: 4 },
     subtitle: { color: '#666', fontSize: 14, marginBottom: 8 },
     searchBox: { flexDirection: 'row', alignItems: 'center', margin: 16, backgroundColor: '#fff', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6, elevation: 1 },
     input: { flex: 1, fontSize: 15, padding: 6 },
     filterBtn: { marginLeft: 8, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6, backgroundColor: '#fff', borderWidth: 1, borderColor: '#f59e42' },
     sectionTitle: { fontSize: 18, fontWeight: 'bold', marginHorizontal: 16, marginTop: 16, marginBottom: 8, color: '#222' },
     card: { width: 260, backgroundColor: '#fff', borderRadius: 12, marginLeft: 16, marginRight: 4, elevation: 2, overflow: 'hidden' },
     cardImage: { width: '100%', height: 110, borderTopLeftRadius: 12, borderTopRightRadius: 12 },
     cardContent: { padding: 12 },
     tagRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4, gap: 6 },
     trendingTag: { backgroundColor: '#fde68a', color: '#b45309', fontSize: 11, fontWeight: 'bold', borderRadius: 6, paddingHorizontal: 6, marginRight: 6 },
     tag: { backgroundColor: '#f3f4f6', color: '#222', fontSize: 11, borderRadius: 6, paddingHorizontal: 6, marginRight: 6 },
     cardTitle: { fontWeight: 'bold', fontSize: 15, marginBottom: 2, color: '#222' },
     cardDesc: { color: '#444', fontSize: 13, marginBottom: 8 },
     cardFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
     footerText: { color: '#888', fontSize: 12 },
     readMore: { color: '#f59e42', fontWeight: 'bold', fontSize: 12 },
     cardVertical: { backgroundColor: '#fff', borderRadius: 12, marginHorizontal: 16, marginTop: 12, elevation: 1, flexDirection: 'row', overflow: 'hidden' },
     cardImageVertical: { width: 90, height: '100%' },
     cardContentVertical: { flex: 1, padding: 10, justifyContent: 'center' },
});