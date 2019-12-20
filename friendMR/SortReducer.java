import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;

import org.apache.hadoop.io.DoubleWritable;
import org.apache.hadoop.io.IntWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Reducer;


public class SortReducer extends Reducer<IntWritable,DoubleWritable,Text,DoubleWritable>
{
	public void reduce(IntWritable key, Iterable<DoubleWritable> values, Context context) throws IOException, InterruptedException 
	{
		ArrayList<Double> diffs = new ArrayList<Double>();//list of differences computed
		for (DoubleWritable diffValue : values){
			diffs.add(diffValue.get());
		}
		 
		Collections.sort(diffs);
		double maxDiff = diffs.get(diffs.size()-1);//get last value (largest diff)
		
		context.write(null, new DoubleWritable(maxDiff));
	}
}