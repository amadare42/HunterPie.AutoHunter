using System;
using System.ComponentModel;
using System.Runtime.CompilerServices;
using System.Windows;
using System.Windows.Threading;

namespace Plugin.AutoHunter.Widget
{
    public class LogEntryViewModel : INotifyPropertyChanged
    {
        public string Text { get; protected set; }
        public int Countdown { get; set; }

        public Visibility CountdownVisibility => this.Countdown > 0 ? Visibility.Visible : Visibility.Collapsed;
        public Visibility CounterVisibility => this.Counter > 1 ? Visibility.Visible : Visibility.Collapsed;
        
        private DispatcherTimer timer;
        private bool isOutdated;

        public bool IsOutdated
        {
            get => this.isOutdated;
            set
            {
                if (this.isOutdated != value)
                {
                    this.isOutdated = value;
                    OnPropertyChanged();
                }
            }
        }

        private int counter = 1;
        private DateTime createdTime;

        public int Counter
        {
            get => this.counter;
            set
            {
                if (this.counter == value) return;
                this.counter = value;
                OnPropertyChanged(nameof(this.CounterText));
                OnPropertyChanged(nameof(this.CounterVisibility));
                OnPropertyChanged(nameof(this.DisplayText));
                OnPropertyChanged();
            }
        }

        public string CounterText => this.Counter.ToString();

        public string DisplayTime => $"{this.CreatedTime:HH:mm:ss.fff}";

        public string DisplayText => $"{this.Text}";
        
        public DateTime LastUpdateTime { get; set; }

        public DateTime CreatedTime
        {
            get => this.createdTime;
            set
            {
                this.createdTime = value;
                OnPropertyChanged(nameof(this.DisplayTime));
            }
        }

        public LogEntryViewModel(string text, int countdown = 0)
        {
            this.CreatedTime = this.LastUpdateTime = DateTime.Now;
            this.Text = text;
            this.Countdown = countdown;
        }

        public void UpdateCountdown()
        {
            this.Countdown -= (int) (DateTime.Now - this.LastUpdateTime).TotalMilliseconds;
            if (this.Countdown < 0)
            {
                this.Countdown = 0;
            }
            OnPropertyChanged(nameof(this.Countdown));
            OnPropertyChanged(nameof(this.CountdownVisibility));
            
            this.LastUpdateTime = DateTime.Now;
        }

        public void InvalidateCountdown()
        {
            this.LastUpdateTime = default(DateTime);
        }

        public event PropertyChangedEventHandler PropertyChanged;

        protected virtual void OnPropertyChanged([CallerMemberName] string propertyName = null)
        {
            this.PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propertyName));
        }
    }
}