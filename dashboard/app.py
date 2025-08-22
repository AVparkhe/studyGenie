import time
import os
from firebase_admin import credentials, firestore, initialize_app

# Force IPv4 for gRPC
os.environ["GRPC_DNS_RESOLVER"] = "native"
os.environ["GRPC_DEFAULT_AUTHORITY"] = "firestore.googleapis.com"

import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
from plotly.subplots import make_subplots
import streamlit as st
from firebase_service import get_scores

# ---------------- Settings ----------------
COLLECTION_NAME = "scores"
DEFAULT_REFRESH_SEC = 5

# Custom color palette
COLORS = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', 
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
]

# Custom CSS for better styling
CUSTOM_CSS = """
<style>
    .main-header {
        background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
        padding: 2rem;
        border-radius: 10px;
        margin-bottom: 2rem;
        text-align: center;
        color: white;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    
    .metric-card {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        padding: 1.5rem;
        border-radius: 15px;
        text-align: center;
        color: white;
        box-shadow: 0 8px 32px rgba(31, 38, 135, 0.37);
        backdrop-filter: blur(4px);
        border: 1px solid rgba(255, 255, 255, 0.18);
        margin: 0.5rem;
    }
    
    .section-header {
        background: linear-gradient(90deg, #FF6B6B, #4ECDC4);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        font-size: 1.8rem;
        font-weight: bold;
        margin: 2rem 0 1rem 0;
        text-align: center;
    }
    
    .stats-container {
        background: rgba(255, 255, 255, 0.05);
        backdrop-filter: blur(10px);
        border-radius: 20px;
        padding: 1rem;
        margin: 1rem 0;
        border: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .highlight-number {
        font-size: 2.5rem;
        font-weight: bold;
        color: #4ECDC4;
    }
</style>
"""

# ------------------------------------------

st.set_page_config(
    page_title="Firebase Dashboard", 
    page_icon="🔥", 
    layout="wide",
    initial_sidebar_state="expanded"
)

# Apply custom CSS
st.markdown(CUSTOM_CSS, unsafe_allow_html=True)

# Enhanced header
st.markdown("""
<div class="main-header">
    <h1>🔥 Real-Time Firebase Dashboard</h1>
    <p>Interactive Analytics for Student Performance Data</p>
    <small>Collection: <code>scores</code></small>
</div>
""", unsafe_allow_html=True)

# Enhanced sidebar
with st.sidebar:
    st.markdown("### ⚙️ Dashboard Controls")
    
    # Add some visual elements
    st.markdown("---")
    refresh = st.slider(
        "🔄 Refresh Interval (seconds)", 
        min_value=2, 
        max_value=30, 
        value=DEFAULT_REFRESH_SEC,
        help="How often to update the dashboard"
    )
    
    live = st.toggle(
        "📡 Live Mode", 
        value=True,
        help="Enable real-time data updates"
    )
    
    st.markdown("---")
    st.markdown("### 📊 Dashboard Features")
    st.markdown("✅ Real-time data updates")
    st.markdown("✅ Interactive visualizations")
    st.markdown("✅ Performance metrics")
    st.markdown("✅ Responsive design")

placeholder = st.empty()

def create_enhanced_charts(df: pd.DataFrame):
    """Create multiple enhanced visualizations"""
    
    # 1. Enhanced Bar Chart with custom colors
    fig_bar = px.bar(
        df, 
        x="Subject", 
        y="Marks", 
        color="Subject",
        text="Marks",
        title="📊 Performance by Subject",
        color_discrete_sequence=COLORS,
        template="plotly_white"
    )
    
    fig_bar.update_traces(
        texttemplate='%{text}',
        textposition='outside',
        marker_line_color='rgb(8,48,107)',
        marker_line_width=1.5,
        textfont_size=14,
        textfont_color="black"
    )
    
    fig_bar.update_layout(
        showlegend=True,
        title_font_size=20,
        title_x=0.5,
        plot_bgcolor='rgba(0,0,0,0)',
        paper_bgcolor='rgba(0,0,0,0)',
        font=dict(family="Arial, sans-serif", size=12),
        height=500
    )
    
    # 2. Donut Chart for distribution
    fig_donut = px.pie(
        df, 
        names="Subject", 
        values="Marks",
        title="📈 Marks Distribution by Subject",
        color_discrete_sequence=COLORS,
        hole=0.4
    )
    
    fig_donut.update_traces(
        textposition='inside',
        textinfo='percent+label',
        hovertemplate='<b>%{label}</b><br>Marks: %{value}<br>Percentage: %{percent}<extra></extra>'
    )
    
    fig_donut.update_layout(
        title_font_size=20,
        title_x=0.5,
        font=dict(family="Arial, sans-serif", size=12),
        plot_bgcolor='rgba(0,0,0,0)',
        paper_bgcolor='rgba(0,0,0,0)',
        height=500
    )
    
    # 3. Box Plot for performance analysis
    fig_box = px.box(
        df, 
        y="Marks", 
        x="Subject",
        color="Subject",
        title="📊 Performance Distribution Analysis",
        color_discrete_sequence=COLORS,
        points="all"
    )
    
    fig_box.update_layout(
        title_font_size=20,
        title_x=0.5,
        plot_bgcolor='rgba(0,0,0,0)',
        paper_bgcolor='rgba(0,0,0,0)',
        font=dict(family="Arial, sans-serif", size=12),
        height=400
    )
    
    return fig_bar, fig_donut, fig_box

def render_enhanced_kpis(df: pd.DataFrame):
    """Render enhanced KPI cards"""
    avg_marks = df['Marks'].mean()
    max_marks = df['Marks'].max()
    min_marks = df['Marks'].min()
    total_subjects = df['Subject'].nunique()
    
    col1, col2, col3, col4 = st.columns(4)
    
    with col1:
        st.markdown(f"""
        <div class="metric-card">
            <h3>📊 Average Score</h3>
            <div class="highlight-number">{avg_marks:.1f}</div>
            <p>Overall Performance</p>
        </div>
        """, unsafe_allow_html=True)
    
    with col2:
        st.markdown(f"""
        <div class="metric-card">
            <h3>🏆 Highest Score</h3>
            <div class="highlight-number">{max_marks}</div>
            <p>Best Performance</p>
        </div>
        """, unsafe_allow_html=True)
    
    with col3:
        st.markdown(f"""
        <div class="metric-card">
            <h3>📉 Lowest Score</h3>
            <div class="highlight-number">{min_marks}</div>
            <p>Needs Improvement</p>
        </div>
        """, unsafe_allow_html=True)
    
    with col4:
        st.markdown(f"""
        <div class="metric-card">
            <h3>📚 Total Subjects</h3>
            <div class="highlight-number">{total_subjects}</div>
            <p>Subjects Tracked</p>
        </div>
        """, unsafe_allow_html=True)

def render_dashboard(df: pd.DataFrame):
    if df.empty:
        st.warning("⚠️ No data found in Firestore collection 'scores'")
        st.info("💡 Add some data to your Firebase collection to see the magic happen!")
        return
    
    # Enhanced KPIs
    render_enhanced_kpis(df)
    
    # Add some spacing
    st.markdown("<br>", unsafe_allow_html=True)
    
    # Create charts
    fig_bar, fig_donut, fig_box = create_enhanced_charts(df)
    
    # Display charts in columns
    col1, col2 = st.columns([2, 1])
    
    with col1:
        st.plotly_chart(fig_bar, use_container_width=True)
    
    with col2:
        st.plotly_chart(fig_donut, use_container_width=True)
    
    # Box plot in full width
    st.plotly_chart(fig_box, use_container_width=True)
    
    # Enhanced data table
    st.markdown('<h3 class="section-header">📋 Raw Data Explorer</h3>', unsafe_allow_html=True)
    
    # Add summary stats
    col1, col2 = st.columns([1, 1])
    
    with col1:
        st.markdown("### 📈 Quick Statistics")
        stats_df = df.groupby('Subject')['Marks'].agg(['mean', 'max', 'min', 'count']).round(2)
        stats_df.columns = ['Average', 'Maximum', 'Minimum', 'Count']
        st.dataframe(stats_df, use_container_width=True)
    
    with col2:
        st.markdown("### 🎯 Performance Insights")
        
        best_subject = df.loc[df['Marks'].idxmax(), 'Subject']
        worst_subject = df.loc[df['Marks'].idxmin(), 'Subject']
        avg_by_subject = df.groupby('Subject')['Marks'].mean()
        top_performing_subject = avg_by_subject.idxmax()
        
        st.markdown(f"🏆 **Best Individual Score:** {best_subject}")
        st.markdown(f"📚 **Top Performing Subject:** {top_performing_subject}")
        st.markdown(f"📊 **Average Score Range:** {df['Marks'].min()} - {df['Marks'].max()}")
        st.markdown(f"📈 **Standard Deviation:** {df['Marks'].std():.2f}")
    
    # Enhanced raw data table
    st.markdown("### 📊 Complete Data")
    
    # Add color coding to the dataframe
    def highlight_scores(val):
        if val >= 8:
            color = '#d4edda'  # Green for high scores
        elif val >= 6:
            color = '#fff3cd'  # Yellow for medium scores
        else:
            color = '#f8d7da'  # Red for low scores
        return f'background-color: {color}'
    
    styled_df = df.style.applymap(highlight_scores, subset=['Marks'])
    st.dataframe(styled_df, use_container_width=True)

def load_data():
    try:
        data = get_scores(COLLECTION_NAME)
        if not data:
            return pd.DataFrame()
        return pd.DataFrame(data)
    except Exception as e:
        st.error(f"❌ Error loading data: {str(e)}")
        return pd.DataFrame()

# Enhanced live loop with progress indicator
if live:
    progress_placeholder = st.empty()
    
    while True:
        with placeholder.container():
            df = load_data()
            render_dashboard(df)
            
            # Show live indicator
            with progress_placeholder.container():
                st.markdown(f"""
                <div style='text-align: center; padding: 1rem; background: rgba(76, 175, 80, 0.1); 
                           border-radius: 10px; margin: 1rem 0;'>
                    🟢 <strong>Live Mode Active</strong> | 
                    Next update in {refresh} seconds | 
                    Last updated: {pd.Timestamp.now().strftime('%H:%M:%S')}
                </div>
                """, unsafe_allow_html=True)
        
        time.sleep(refresh)
else:
    with placeholder.container():
        df = load_data()
        render_dashboard(df)
        
        st.markdown("""
        <div style='text-align: center; padding: 1rem; background: rgba(255, 193, 7, 0.1); 
                   border-radius: 10px; margin: 1rem 0;'>
            ⏸️ <strong>Static Mode</strong> | Enable Live Mode from the sidebar for real-time updates
        </div>
        """, unsafe_allow_html=True)